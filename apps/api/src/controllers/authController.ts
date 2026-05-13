import type { Request, Response } from "express";
import { z } from "zod";
import { hashPassword, verifyPassword, signAccessToken, signRefreshToken, verifyRefreshToken } from "../config/auth.js";
import { getPrisma, isDbAvailable } from "../services/prisma.js";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
  displayName: z.string().min(1).max(64).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const refreshSchema = z.object({
  refreshToken: z.string()
});

export async function signup(req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.status(503).json({ error: { code: "DB_UNAVAILABLE", message: "Database is not available. Seed a database to enable user accounts." } });
    return;
  }

  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid signup data", issues: parsed.error.issues } });
    return;
  }

  const { email, password, displayName } = parsed.data;
  const prisma = getPrisma();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: { code: "EMAIL_TAKEN", message: "An account with this email already exists" } });
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, displayName: displayName ?? email.split("@")[0] ?? email }
  });

  const accessToken = signAccessToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
  const refreshToken = signRefreshToken(user.id);

  // Store refresh session
  await prisma.authSession.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  res.status(201).json({
    user: { id: user.id, email: user.email, displayName: user.displayName, isAdmin: user.isAdmin },
    accessToken,
    refreshToken
  });
}

export async function login(req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.status(503).json({ error: { code: "DB_UNAVAILABLE", message: "Database is not available." } });
    return;
  }

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid login data", issues: parsed.error.issues } });
    return;
  }

  const { email, password } = parsed.data;
  const prisma = getPrisma();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    return;
  }

  const accessToken = signAccessToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
  const refreshToken = signRefreshToken(user.id);

  await prisma.authSession.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  res.json({
    user: { id: user.id, email: user.email, displayName: user.displayName, isAdmin: user.isAdmin },
    accessToken,
    refreshToken
  });
}

export async function refresh(req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.status(503).json({ error: { code: "DB_UNAVAILABLE", message: "Database is not available." } });
    return;
  }

  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Refresh token required" } });
    return;
  }

  try {
    const { userId } = verifyRefreshToken(parsed.data.refreshToken);
    const prisma = getPrisma();

    // Verify session exists in DB
    const session = await prisma.authSession.findUnique({ where: { token: parsed.data.refreshToken } });
    if (!session || session.expiresAt < new Date()) {
      res.status(401).json({ error: { code: "SESSION_EXPIRED", message: "Refresh token expired or revoked" } });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(401).json({ error: { code: "USER_NOT_FOUND", message: "User no longer exists" } });
      return;
    }

    // Rotate refresh token
    await prisma.authSession.delete({ where: { id: session.id } });

    const accessToken = signAccessToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
    const newRefresh = signRefreshToken(user.id);

    await prisma.authSession.create({
      data: {
        userId: user.id,
        token: newRefresh,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      user: { id: user.id, email: user.email, displayName: user.displayName, isAdmin: user.isAdmin },
      accessToken,
      refreshToken: newRefresh
    });
  } catch {
    res.status(401).json({ error: { code: "INVALID_TOKEN", message: "Invalid refresh token" } });
  }
}

export async function logout(req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.json({ success: true });
    return;
  }

  const token = req.body.refreshToken;
  if (token) {
    try {
      await getPrisma().authSession.deleteMany({ where: { token } });
    } catch {
      // Token may already be deleted
    }
  }

  res.json({ success: true });
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  if (!isDbAvailable()) {
    res.json({ user: { id: req.user.userId, email: req.user.email, isAdmin: req.user.isAdmin } });
    return;
  }

  const user = await getPrisma().user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true, email: true, displayName: true, avatarUrl: true,
      nativeLanguage: true, isAdmin: true, createdAt: true
    }
  });

  if (!user) {
    res.status(404).json({ error: { code: "USER_NOT_FOUND", message: "User not found" } });
    return;
  }

  res.json({ user });
}
