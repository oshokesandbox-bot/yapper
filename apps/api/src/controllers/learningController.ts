import type { Request, Response } from "express";
import {
  getLessonById,
  getRecommendationById,
  languageCodeSchema,
  lessonsForLanguage,
  recommendationsForLanguage,
  seedLessons,
  seedRecommendations,
  productStages
} from "@yapper/shared";
import { getPrisma, isDbAvailable } from "../services/prisma.js";

export async function listLessons(req: Request, res: Response) {
  if (!isDbAvailable()) {
    const parsedLanguage = languageCodeSchema.safeParse(req.query.language);
    const lessons = parsedLanguage.success ? lessonsForLanguage(parsedLanguage.data) : seedLessons;
    res.json({ lessons });
    return;
  }

  const prisma = getPrisma();
  const parsedLanguage = languageCodeSchema.safeParse(req.query.language);

  const where = parsedLanguage.success
    ? { language: parsedLanguage.data.toUpperCase() as "EN" | "FR" | "ES" | "DE" | "RU" }
    : {};

  const lessons = await prisma.lesson.findMany({
    where,
    include: { steps: { orderBy: { order: "asc" } }, stage: true },
    orderBy: { createdAt: "desc" }
  });

  res.json({ lessons });
}

export async function getLesson(req: Request, res: Response) {
  const lessonId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!isDbAvailable()) {
    const lesson = getLessonById(lessonId ?? "");
    if (!lesson) {
      res.status(404).json({ error: { code: "LESSON_NOT_FOUND", message: "Lesson not found" } });
      return;
    }
    res.json({ lesson });
    return;
  }

  const prisma = getPrisma();
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId ?? "" },
    include: { steps: { orderBy: { order: "asc" } }, stage: true }
  });

  if (!lesson) {
    res.status(404).json({ error: { code: "LESSON_NOT_FOUND", message: "Lesson not found" } });
    return;
  }

  res.json({ lesson });
}

export async function listRecommendations(req: Request, res: Response) {
  const parsedLanguage = languageCodeSchema.safeParse(req.query.language);
  const mediaType = typeof req.query.mediaType === "string" ? req.query.mediaType : undefined;
  const stageHintId = typeof req.query.stage === "string" ? parseInt(req.query.stage, 10) : undefined;

  if (!isDbAvailable()) {
    let recommendations = parsedLanguage.success ? recommendationsForLanguage(parsedLanguage.data) : [...seedRecommendations];

    if (mediaType) {
      recommendations = recommendations.filter((r) => r.mediaType === mediaType);
    }
    if (stageHintId && !isNaN(stageHintId)) {
      recommendations = recommendations.filter((r) => r.stageHintId === stageHintId);
    }

    res.json({ recommendations });
    return;
  }

  const prisma = getPrisma();

  const where: Record<string, unknown> = {};

  if (parsedLanguage.success) {
    where.language = parsedLanguage.data.toUpperCase();
  }
  if (mediaType) {
    where.mediaType = mediaType;
  }
  if (stageHintId && !isNaN(stageHintId)) {
    where.stageHintId = stageHintId;
  }

  const recommendations = await prisma.mediaRecommendation.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });

  res.json({ recommendations });
}

export async function getRecommendation(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!isDbAvailable()) {
    const rec = getRecommendationById(id ?? "");
    if (!rec) {
      res.status(404).json({ error: { code: "RECOMMENDATION_NOT_FOUND", message: "Recommendation not found" } });
      return;
    }

    const stage = productStages.find((s) => s.slug === rec.stageSlug);
    const related = recommendationsForLanguage(rec.language).filter((r) => r.id !== rec.id).slice(0, 3);

    res.json({ recommendation: { ...rec, stageLabel: stage?.label ?? null }, related });
    return;
  }

  const prisma = getPrisma();
  const rec = await prisma.mediaRecommendation.findUnique({
    where: { id: id ?? "" }
  });

  if (!rec) {
    res.status(404).json({ error: { code: "RECOMMENDATION_NOT_FOUND", message: "Recommendation not found" } });
    return;
  }

  const stage = rec.stageHintId ? await prisma.stage.findUnique({ where: { id: rec.stageHintId } }) : null;
  const related = await prisma.mediaRecommendation.findMany({
    where: { language: rec.language, id: { not: rec.id } },
    take: 3
  });

  res.json({ recommendation: { ...rec, stageLabel: stage?.label ?? null }, related });
}

export async function getPhaseOneCatalog(_req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.json({ lessons: seedLessons, recommendations: seedRecommendations });
    return;
  }

  const prisma = getPrisma();

  const [lessons, recommendations] = await Promise.all([
    prisma.lesson.findMany({
      include: { steps: { orderBy: { order: "asc" } }, stage: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.mediaRecommendation.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  res.json({ lessons, recommendations });
}
