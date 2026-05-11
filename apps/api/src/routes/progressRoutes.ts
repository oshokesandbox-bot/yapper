import { Router } from "express";
import { getProgress, saveLessonProgress, updateStageProgress } from "../controllers/progressController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const progressRoutes = Router();

progressRoutes.get("/api/progress", authMiddleware, getProgress);
progressRoutes.post("/api/progress/lesson", authMiddleware, saveLessonProgress);
progressRoutes.put("/api/progress/stage", authMiddleware, updateStageProgress);
