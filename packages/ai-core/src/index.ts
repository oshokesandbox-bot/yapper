import { z } from "zod";
import { contentKindSchema, languageCodeSchema, stageSlugSchema } from "@yapper/shared";

// Re-export shared schemas for convenience
export { contentKindSchema, languageCodeSchema, stageSlugSchema };

// ---------- Request / Response Schemas ----------

export const aiGenerationRequestSchema = z.object({
  language: languageCodeSchema,
  stage: stageSlugSchema,
  kind: contentKindSchema,
  topic: z.string().min(2).max(120),
  targetVocabulary: z.array(z.string()).default([]),
  difficulty: z.enum(["seed", "mvp", "stretch"]).default("mvp")
});

export type AiGenerationRequest = z.infer<typeof aiGenerationRequestSchema>;

export const aiGenerationResultSchema = z.object({
  language: languageCodeSchema,
  stage: stageSlugSchema,
  kind: contentKindSchema,
  topic: z.string(),
  output: z.record(z.unknown()),
  warnings: z.array(z.string()).default([])
});

export type AiGenerationResult = z.infer<typeof aiGenerationResultSchema>;

// ---------- Mock generator for local dev ----------

function mockGenerate(request: AiGenerationRequest): AiGenerationResult {
  const stubOutput: Record<string, unknown> = {
    title: `${request.topic} – ${request.kind.replace(/_/g, " ")}`,
    language: request.language,
    stage: request.stage,
    content: `This is mock ${request.kind} content about "${request.topic}" in ${request.language} for stage "${request.stage}". Replace with real AI output.`,
    vocabulary: request.targetVocabulary.length > 0
      ? request.targetVocabulary.map((word) => ({
          term: word,
          translation: `[${request.language} translation of "${word}"]`,
          concept: "generated"
        }))
      : []
  };

  return {
    language: request.language,
    stage: request.stage,
    kind: request.kind,
    topic: request.topic,
    output: stubOutput,
    warnings: ["Mock AI generation — replace with real provider for production"]
  };
}

// ---------- OpenAI generator (used when API key is available) ----------

async function openAiGenerate(request: AiGenerationRequest, apiKey: string, model?: string): Promise<AiGenerationResult> {
  const { buildContentPrompt } = await import("./promptBuilder.js");
  const prompt = buildContentPrompt(request);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Yapper's content generation engine. Generate language-learning content as strict valid JSON matching the requested schema. Keep content age-neutral, culturally respectful, and level-controlled."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  const parsed = JSON.parse(content) as Record<string, unknown>;

  const result: AiGenerationResult = {
    language: request.language,
    stage: request.stage,
    kind: request.kind,
    topic: request.topic,
    output: parsed,
    warnings: []
  };

  return aiGenerationResultSchema.parse(result);
}

// ---------- Main generator ----------

export async function generateContent(
  request: AiGenerationRequest,
  options?: { apiKey?: string; model?: string }
): Promise<AiGenerationResult> {
  const apiKey = options?.apiKey ?? process.env.OPENAI_API_KEY ?? "";

  if (!apiKey) {
    return mockGenerate(request);
  }

  return openAiGenerate(request, apiKey, options?.model);
}

// validate AI output against expected schemas for each content kind
export function validateContentKindOutput(kind: string, output: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
} {
  // Basic structural validation per content kind
  switch (kind) {
    case "micro_story":
    case "dialogue": {
      const text = output["text"] ?? output["content"];
      return {
        valid: typeof text === "string" && text.length > 10,
        errors: typeof text !== "string" ? ["Missing or invalid 'text' field"] : text.length <= 10 ? ["Content too short"] : []
      };
    }
    case "vocabulary_card": {
      const cards = output["cards"] ?? output["vocabulary"];
      const hasCards = Array.isArray(cards) && cards.length > 0;
      return {
        valid: hasCards,
        errors: hasCards ? [] : ["Missing or empty vocabulary cards array"]
      };
    }
    case "comprehension_question":
    case "composition_prompt":
    case "sentence_prompt": {
      const prompt = output["prompt"] ?? output["question"];
      return {
        valid: typeof prompt === "string" && prompt.length > 5,
        errors: typeof prompt !== "string" ? ["Missing prompt/question field"] : prompt.length <= 5 ? ["Prompt too short"] : []
      };
    }
    default:
      return { valid: true, errors: [] };
  }
}
