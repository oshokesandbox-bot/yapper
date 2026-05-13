import { Router } from "express";
import { generateAiContent, listAiGenerations, reviewAiGeneration } from "../controllers/aiController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

export const aiRoutes = Router();

aiRoutes.post("/ai/generate", requireAuth, generateAiContent);
aiRoutes.get("/ai/generations", requireAuth, requireAdmin, listAiGenerations);
aiRoutes.patch("/ai/generations/:id/review", requireAuth, requireAdmin, reviewAiGeneration);
