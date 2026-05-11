import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const languageCodeSchema = z.enum(["EN", "FR", "ES", "DE", "RU"]);

const lessonProgressSchema = z.object({
  language: languageCodeSchema,
  lessonId: z.string().min(1)
});

const stageProgressSchema = z.object({
  language: languageCodeSchema,
  stageId: z.coerce.number().int().positive()
});

export async function getProgress(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Not authenticated" }
    });
    return;
  }

  const language = req.query.language;
  const parsedLanguage = typeof language === "string" ? languageCodeSchema.safeParse(language.toUpperCase()) : null;

  const where = parsedLanguage?.success
    ? { userId, language: parsedLanguage.data }
    : { userId };

  const progresses = await prisma.userLanguageProgress.findMany({
    where,
    include: { currentStage: true }
  });

  res.json({ progresses });
}

export async function saveLessonProgress(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Not authenticated" }
    });
    return;
  }

  const parsed = lessonProgressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Invalid request body", issues: parsed.error.issues }
    });
    return;
  }

  const { language, lessonId } = parsed.data;

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    res.status(404).json({
      error: { code: "LESSON_NOT_FOUND", message: "Lesson not found" }
    });
    return;
  }

  // Upsert progress — create if not exists, update stage if needed
  const progress = await prisma.userLanguageProgress.upsert({
    where: { userId_language: { userId, language } },
    update: {
      currentStageId: lesson.stageId,
      stageProgress: { increment: 0.1 }
    },
    create: {
      userId,
      language,
      currentStageId: lesson.stageId,
      stageProgress: 0.1
    }
  });

  res.json({ progress });
}

export async function updateStageProgress(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Not authenticated" }
    });
    return;
  }

  const parsed = stageProgressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Invalid request body", issues: parsed.error.issues }
    });
    return;
  }

  const { language, stageId } = parsed.data;

  const stage = await prisma.stage.findUnique({ where: { id: stageId } });
  if (!stage) {
    res.status(404).json({
      error: { code: "STAGE_NOT_FOUND", message: "Stage not found" }
    });
    return;
  }

  const progress = await prisma.userLanguageProgress.upsert({
    where: { userId_language: { userId, language } },
    update: { currentStageId: stageId },
    create: {
      userId,
      language,
      currentStageId: stageId,
      stageProgress: 0
    }
  });

  res.json({ progress });
}
