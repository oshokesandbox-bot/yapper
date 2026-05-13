import type { AiGenerationRequest } from "./index.js";

export function buildContentPrompt(request: AiGenerationRequest): string {
  return [
    `Generate Yapper learning content as strict JSON.`,
    `Language: ${request.language}`,
    `Stage: ${request.stage}`,
    `Kind: ${request.kind}`,
    `Topic: ${request.topic}`,
    `Target vocabulary: ${request.targetVocabulary.join(", ") || "none"}`,
    `Difficulty: ${request.difficulty}`,
    `Rules:`,
    `- Keep content age-neutral and culturally respectful`,
    `- Use simple, level-appropriate language`,
    `- Make output easy for a human reviewer to edit`,
    `- Output must be valid JSON with at minimum: title, language, stage, content fields`,
    `- For vocabulary_card kind: include a "cards" array with term, translation, concept entries`,
    `- For micro_story: include "text" and "glossary" (array of {term, translation})`,
    `- For dialogue: include "text" and "speakers" array`,
    `- For comprehension_question/composition_prompt/sentence_prompt: include "prompt" and optionally "options"`
  ].join("\n");
}
