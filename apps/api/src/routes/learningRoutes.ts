import { Router } from "express";
import { getLesson, getPhaseOneCatalog, getRecommendation, listLessons, listRecommendations } from "../controllers/learningController.js";

export const learningRoutes = Router();
learningRoutes.get("/phase-one", getPhaseOneCatalog);
learningRoutes.get("/lessons", listLessons);
learningRoutes.get("/lessons/:id", getLesson);
learningRoutes.get("/recommendations", listRecommendations);
learningRoutes.get("/recommendations/:id", getRecommendation);
