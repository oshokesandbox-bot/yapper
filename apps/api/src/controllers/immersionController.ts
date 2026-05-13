import type { Request, Response } from "express";
import { z } from "zod";
import { languageCodeSchema } from "@yapper/shared";
import { getPrisma, isDbAvailable } from "../services/prisma.js";

const completeImmersionSchema = z.object({
  recommendationId: z.string().min(1),
  notes: z.string().optional().default(""),
  reflections: z.array(z.string()).optional().default([]),
  language: languageCodeSchema
});

function toPrismaLang(language: string): "EN" | "FR" | "ES" | "DE" | "RU" {
  return language.toUpperCase() as "EN" | "FR" | "ES" | "DE" | "RU";
}

export async function completeImmersion(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const parsed = completeImmersionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid immersion data", issues: parsed.error.issues } });
    return;
  }

  const { recommendationId, notes, reflections, language } = parsed.data;

  if (!isDbAvailable()) {
    // DB unavailable — return success without saving
    res.json({ success: true, immersion: { recommendationId, language, notes, reflections, completed: true } });
    return;
  }

  const prisma = getPrisma();
  const userId = req.user.userId;

  // Create a lesson progress record for this immersion session
  // Use recommendation ID as a virtual lesson ID
  const lessonId = `immersion-${recommendationId}`;
  const langCode = toPrismaLang(language);

  // Find or create a "virtual" immersion lesson entry
  const existingLesson = await prisma.lesson.findUnique({ where: { id: lessonId } });

  if (!existingLesson) {
    // Find the recommendation to get title
    const rec = await prisma.mediaRecommendation.findUnique({ where: { id: recommendationId } });

    await prisma.lesson.create({
      data: {
        id: lessonId,
        language: langCode,
        stageId: 1, // Immersion stage
        title: `Immersion: ${rec?.title ?? "Self-directed media"}`,
        subtitle: "Completed through the immersion browser flow.",
        status: "PUBLISHED",
        estimatedMinutes: 15
      }
    });
  }

  // Upsert the progress
  await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true, score: reflections.length > 0 ? Math.min(reflections.length * 33, 100) : 50 },
    create: {
      userId,
      lessonId,
      completed: true,
      score: reflections.length > 0 ? Math.min(reflections.length * 33, 100) : 50
    }
  });

  // Also update language progress if needed
  const existingProgress = await prisma.userLanguageProgress.findUnique({
    where: { userId_language: { userId, language: langCode } }
  });

  if (existingProgress) {
    await prisma.userLanguageProgress.update({
      where: { userId_language: { userId, language: langCode } },
      data: { stageProgress: Math.min(existingProgress.stageProgress + 5, 100) }
    });
  } else {
    await prisma.userLanguageProgress.create({
      data: {
        userId,
        language: langCode,
        currentStageId: 1,
        stageProgress: 5
      }
    });
  }

  res.json({
    success: true,
    immersion: {
      recommendationId,
      language,
      notes,
      reflections,
      completed: true
    }
  });
}
