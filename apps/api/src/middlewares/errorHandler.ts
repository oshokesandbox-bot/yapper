import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: `Route ${req.method} ${req.path} not found` } });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid request", issues: error.issues } });
    return;
  }

  const message = error instanceof Error ? error.message : "Unexpected error";
  res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message } });
}
