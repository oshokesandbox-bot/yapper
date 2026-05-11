import type { Request, Response } from "express";
import { languages, productStages } from "@yapper/shared";

export function listLanguages(_req: Request, res: Response) {
  res.json({ languages: Object.values(languages) });
}

export function listStages(_req: Request, res: Response) {
  res.json({ stages: productStages });
}
