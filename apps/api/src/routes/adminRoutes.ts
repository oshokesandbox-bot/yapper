import { Router } from "express";
import { listUsers, getStats, updateLessonStatus } from "../controllers/adminController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

export const adminRoutes = Router();

adminRoutes.get("/admin/users", requireAuth, requireAdmin, listUsers);
adminRoutes.get("/admin/stats", requireAuth, requireAdmin, getStats);
adminRoutes.patch("/admin/lessons/:id/status", requireAuth, requireAdmin, updateLessonStatus);
