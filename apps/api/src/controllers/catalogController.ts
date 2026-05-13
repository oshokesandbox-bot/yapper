import type { Request, Response } from "express";
import { languages as seedLanguages, productStages } from "@yapper/shared";
import { getPrisma, isDbAvailable } from "../services/prisma.js";

export async function listLanguages(_req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.json({ languages: Object.values(seedLanguages) });
    return;
  }

  const languages = await getPrisma().language.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" }
  });

  res.json({ languages });
}

export async function listStages(_req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.json({ stages: productStages });
    return;
  }

  const stages = await getPrisma().stage.findMany({
    orderBy: { id: "asc" }
  });

  res.json({ stages });
}
