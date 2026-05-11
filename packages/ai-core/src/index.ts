import { z } from "zod";
import { contentKindSchema, languageCodeSchema, stageSlugSchema } from "@yapper/shared";

export const aiGenerationRequestSchema = z.object({
  language: languageCodeSchema,
  stage: stageSlugSchema,
  kind: contentKindSchema,
  topic: z.string().min(2).max(120),
  targetVocabulary: z.array(z.string()).default([]),
  difficulty: z.enum(["seed", "mvp", "stretch"]).default("mvp")
});

export type AiGenerationRequest = z.infer<typeof aiGenerationRequestSchema>;

export function buildContentPrompt(request: AiGenerationRequest) {
  return [
    `Generate Yapper learning content as strict JSON.`,
    `Language: ${request.language}`,
    `Stage: ${request.stage}`,
    `Kind: ${request.kind}`,
    `Topic: ${request.topic}`,
    `Target vocabulary: ${request.targetVocabulary.join(", ") || "none"}`,
    `Rules: keep content age-neutral, culturally respectful, level-controlled, and easy for a human reviewer to edit.`
  ].join("\n");
}
