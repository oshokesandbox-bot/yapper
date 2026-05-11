import { Router } from "express";
import { getMe, login, signup } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const authRoutes = Router();

authRoutes.post("/api/auth/signup", signup);
authRoutes.post("/api/auth/login", login);
authRoutes.get("/api/auth/me", authMiddleware, getMe);
