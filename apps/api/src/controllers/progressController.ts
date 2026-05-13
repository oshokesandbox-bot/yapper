import type { Request, Response } from "express";
import { z } from "zod";
import { getPrisma, isDbAvailable } from "../services/prisma.js";
import { languageCodeSchema } from "@yapper/shared";

const updateProgressSchema = z.object({
  language: languageCodeSchema,
  stageSlug: z.string(),
  lessonId: z.string().optional(),
  completed: z.boolean().optional(),
  score: z.number().min(0).max(100).optional()
});

function toPrismaLang(language: string): "EN" | "FR" | "ES" | "DE" | "RU" {
  return language.toUpperCase() as "EN" | "FR" | "ES" | "DE" | "RU";
}

export async function getProgress(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  if (!isDbAvailable()) {
    res.json({ progress: [] });
    return;
  }

  const prisma = getPrisma();
  const userId = req.user.userId;

  const languageProgress = await prisma.userLanguageProgress.findMany({
    where: { userId },
    include: { currentStage: true }
  });

  const lessonProgress = await prisma.userLessonProgress.findMany({
    where: { userId },
    include: { lesson: true }
  });

  res.json({
    progress: languageProgress,
    completedLessons: lessonProgress
  });
}

export async function updateProgress(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  if (!isDbAvailable()) {
    res.status(503).json({ error: { code: "DB_UNAVAILABLE", message: "Database is not available." } });
    return;
  }

  const parsed = updateProgressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid progress data", issues: parsed.error.issues } });
    return;
  }

  const { language, stageSlug, lessonId, completed, score } = parsed.data;
  const prisma = getPrisma();
  const userId = req.user.userId;
  const langCode = toPrismaLang(language);

  // Find or create language progress
  const stage = await prisma.stage.findUnique({ where: { slug: stageSlug } });
  if (!stage) {
    res.status(400).json({ error: { code: "STAGE_NOT_FOUND", message: `Stage '${stageSlug}' not found` } });
    return;
  }

  const existing = await prisma.userLanguageProgress.findUnique({
    where: { userId_language: { userId, language: langCode } }
  });

  if (existing) {
    await prisma.userLanguageProgress.update({
      where: { userId_language: { userId, language: langCode } },
      data: {
        currentStageId: stage.id,
        stageProgress: score != null ? score : existing.stageProgress
      }
    });
  } else {
    await prisma.userLanguageProgress.create({
      data: {
        userId,
        language: langCode,
        currentStageId: stage.id,
        stageProgress: score ?? 0
      }
    });
  }

  // Track lesson completion
  if (lessonId && completed) {
    const scoreVal = score != null ? score : null;
    await prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed, score: scoreVal },
      create: { userId, lessonId, completed, score: scoreVal }
    });
  }

  res.json({ success: true });
}
