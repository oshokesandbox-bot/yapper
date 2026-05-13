import type { Request, Response } from "express";
import { z } from "zod";
import { getPrisma, isDbAvailable } from "../services/prisma.js";

const updateLessonStatusSchema = z.object({
  status: z.enum(["draft", "in_review", "published", "archived"])
});

export async function listUsers(req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.json({ users: [] });
    return;
  }

  const prisma = getPrisma();
  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, displayName: true, nativeLanguage: true,
      isAdmin: true, createdAt: true
    },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  res.json({ users });
}

export async function getStats(_req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.json({
      languages: 5,
      stages: 8,
      lessons: { total: 0, published: 0 },
      users: 0,
      pendingGenerations: 0
    });
    return;
  }

  const prisma = getPrisma();
  const [languageCount, stageCount, lessonCount, userCount, pendingGenCount] = await Promise.all([
    prisma.language.count(),
    prisma.stage.count(),
    prisma.lesson.count(),
    prisma.user.count(),
    prisma.aiGeneration.count({ where: { reviewState: "PENDING" } })
  ]);

  const publishedLessons = await prisma.lesson.count({ where: { status: "PUBLISHED" } });

  res.json({
    languages: languageCount,
    stages: stageCount,
    lessons: { total: lessonCount, published: publishedLessons },
    users: userCount,
    pendingGenerations: pendingGenCount
  });
}

export async function updateLessonStatus(req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.status(503).json({ error: { code: "DB_UNAVAILABLE", message: "Database is not available." } });
    return;
  }

  const parsed = updateLessonStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid status", issues: parsed.error.issues } });
    return;
  }

  const lessonId = typeof req.params.id === "string" ? req.params.id : undefined;
  if (!lessonId) {
    res.status(400).json({ error: { code: "INVALID_PARAM", message: "Invalid lesson ID" } });
    return;
  }

  const { status } = parsed.data;

  const prisma = getPrisma();
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });

  if (!lesson) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Lesson not found" } });
    return;
  }

  const updated = await prisma.lesson.update({
    where: { id: lessonId },
    data: { status: status.toUpperCase() as "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED" }
  });

  res.json({ lesson: updated });
}
