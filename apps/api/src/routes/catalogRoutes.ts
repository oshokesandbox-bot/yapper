import { Router } from "express";
import { listLanguages, listStages } from "../controllers/catalogController.js";

export const catalogRoutes = Router();
catalogRoutes.get("/languages", listLanguages);
catalogRoutes.get("/stages", listStages);
