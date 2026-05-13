import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import { generateContent, validateContentKindOutput, aiGenerationRequestSchema } from "@yapper/ai-core";
import { getPrisma, isDbAvailable } from "../services/prisma.js";

export async function generateAiContent(req: Request, res: Response) {
  const parsed = aiGenerationRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid generation request", issues: parsed.error.issues } });
    return;
  }

  const request = parsed.data;

  try {
    const result = await generateContent(request);

    // Validate structured output
    const { valid, errors: validationErrors } = validateContentKindOutput(request.kind, result.output);
    if (!valid) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "Generated content failed validation", details: validationErrors } });
      return;
    }

    // Store in DB if available
    if (isDbAvailable()) {
      const prisma = getPrisma();
      const output = result.output as unknown as Prisma.InputJsonValue;
      const aiGeneration = await prisma.aiGeneration.create({
        data: {
          language: request.language.toUpperCase() as "EN" | "FR" | "ES" | "DE" | "RU",
          stageSlug: request.stage,
          kind: request.kind.toUpperCase() as "VOCABULARY_CARD" | "MICRO_STORY" | "DIALOGUE" | "MINIMAL_PAIR" | "SENTENCE_PROMPT" | "COMPREHENSION_QUESTION" | "COMPOSITION_PROMPT" | "MOVIE_RECOMMENDATION",
          prompt: JSON.stringify(request),
          output,
          reviewState: "PENDING"
        }
      });

      res.status(201).json({
        generation: {
          id: aiGeneration.id,
          language: request.language,
          kind: request.kind,
          stage: request.stage,
          output: result.output,
          reviewState: "pending",
          warnings: result.warnings
        }
      });
      return;
    }

    // No DB — return generated content without persistence
    res.status(201).json({
      generation: {
        id: `mock-${Date.now()}`,
        language: request.language,
        kind: request.kind,
        stage: request.stage,
        output: result.output,
        reviewState: "pending",
        warnings: [...result.warnings, "Database unavailable — content not persisted"]
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    res.status(500).json({ error: { code: "AI_GENERATION_ERROR", message } });
  }
}

export async function listAiGenerations(req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.json({ generations: [] });
    return;
  }

  const rawState = req.query.state;
  const reviewState = typeof rawState === "string" ? rawState : undefined;
  const prisma = getPrisma();

  const where: Record<string, unknown> = reviewState ? { reviewState: reviewState.toUpperCase() } : {};

  const generations = await prisma.aiGeneration.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100
  });

  res.json({ generations });
}

export async function reviewAiGeneration(req: Request, res: Response) {
  if (!isDbAvailable()) {
    res.status(503).json({ error: { code: "DB_UNAVAILABLE", message: "Database is not available." } });
    return;
  }

  const id = typeof req.params.id === "string" ? req.params.id : undefined;
  if (!id) {
    res.status(400).json({ error: { code: "INVALID_PARAM", message: "Invalid generation ID" } });
    return;
  }

  const { reviewState, reviewNotes } = req.body;

  if (!["approved", "rejected", "edited"].includes(reviewState)) {
    res.status(400).json({ error: { code: "INVALID_STATE", message: "reviewState must be approved, rejected, or edited" } });
    return;
  }

  const prisma = getPrisma();

  const generation = await prisma.aiGeneration.findUnique({ where: { id } });
  if (!generation) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "AI generation not found" } });
    return;
  }

  const newState = reviewState.toUpperCase() as "APPROVED" | "REJECTED" | "EDITED";

  const updated = await prisma.aiGeneration.update({
    where: { id },
    data: {
      reviewState: newState
    }
  });

  // Create/review upsert in ContentReview
  const notes = typeof reviewNotes === "string" ? reviewNotes : null;
  const reviewerId = req.user?.userId ?? null;
  await prisma.contentReview.upsert({
    where: { aiGenerationId: id },
    update: {
      reviewState: newState,
      reviewNotes: notes,
      reviewerId
    },
    create: {
      aiGenerationId: id,
      reviewState: newState,
      reviewNotes: notes,
      reviewerId
    }
  });

  res.json({ generation: updated });
}
