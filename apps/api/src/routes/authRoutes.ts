import { Router } from "express";
import { signup, login, refresh, logout, me } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";

export const authRoutes = Router();

authRoutes.post("/auth/signup", signup);
authRoutes.post("/auth/login", login);
authRoutes.post("/auth/refresh", refresh);
authRoutes.post("/auth/logout", logout);
authRoutes.get("/auth/me", requireAuth, me);
