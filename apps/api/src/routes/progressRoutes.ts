import { Router } from "express";
import { getProgress, updateProgress } from "../controllers/progressController.js";
import { requireAuth } from "../middlewares/auth.js";

export const progressRoutes = Router();

progressRoutes.get("/progress", requireAuth, getProgress);
progressRoutes.post("/progress", requireAuth, updateProgress);
