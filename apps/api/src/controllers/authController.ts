import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { env } from "../config/env.js";

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().optional(),
  nativeLanguage: z.enum(["EN", "FR", "ES", "DE", "RU"]).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Invalid request body", issues: parsed.error.issues }
    });
    return;
  }

  const { email, password, displayName, nativeLanguage } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({
      error: { code: "EMAIL_TAKEN", message: "An account with this email already exists" }
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, passwordHash, displayName: displayName ?? null, nativeLanguage: nativeLanguage ?? null }
  });

  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_ACCESS_SECRET, { expiresIn: "7d" });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      nativeLanguage: user.nativeLanguage
    }
  });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Invalid request body", issues: parsed.error.issues }
    });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({
      error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" }
    });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({
      error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" }
    });
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_ACCESS_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      nativeLanguage: user.nativeLanguage
    }
  });
}

export async function getMe(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Not authenticated" }
    });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({
      error: { code: "USER_NOT_FOUND", message: "User not found" }
    });
    return;
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      nativeLanguage: user.nativeLanguage,
      createdAt: user.createdAt
    }
  });
}
