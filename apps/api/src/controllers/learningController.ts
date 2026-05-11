import type { Request, Response } from "express";
import {
  getLessonById,
  languageCodeSchema,
  lessonsForLanguage,
  recommendationsForLanguage,
  seedLessons,
  seedRecommendations
} from "@yapper/shared";

export function listLessons(req: Request, res: Response) {
  const parsedLanguage = languageCodeSchema.safeParse(req.query.language);
  const lessons = parsedLanguage.success ? lessonsForLanguage(parsedLanguage.data) : seedLessons;
  res.json({ lessons });
}

export function getLesson(req: Request, res: Response) {
  const lessonId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const lesson = getLessonById(lessonId ?? "");

  if (!lesson) {
    res.status(404).json({ error: { code: "LESSON_NOT_FOUND", message: "Lesson not found" } });
    return;
  }

  res.json({ lesson });
}

export function listRecommendations(req: Request, res: Response) {
  const parsedLanguage = languageCodeSchema.safeParse(req.query.language);
  const recommendations = parsedLanguage.success ? recommendationsForLanguage(parsedLanguage.data) : seedRecommendations;
  res.json({ recommendations });
}

export function getPhaseOneCatalog(_req: Request, res: Response) {
  res.json({ lessons: seedLessons, recommendations: seedRecommendations });
}
