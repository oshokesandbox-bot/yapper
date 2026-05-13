import { Router } from "express";
import { completeImmersion } from "../controllers/immersionController.js";
import { requireAuth } from "../middlewares/auth.js";

export const immersionRoutes = Router();

immersionRoutes.post("/immersion/complete", requireAuth, completeImmersion);
