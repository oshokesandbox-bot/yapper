import { z } from "zod";

export const languageCodes = ["en", "fr", "es", "de", "ru"] as const;
export type LanguageCode = (typeof languageCodes)[number];

export const languages: Record<LanguageCode, {
  code: LanguageCode;
  englishName: string;
  nativeName: string;
  launchTier: "mvp" | "seed";
  script: "latin" | "cyrillic";
}> = {
  en: { code: "en", englishName: "English", nativeName: "English", launchTier: "mvp", script: "latin" },
  fr: { code: "fr", englishName: "French", nativeName: "Français", launchTier: "mvp", script: "latin" },
  es: { code: "es", englishName: "Spanish", nativeName: "Español", launchTier: "mvp", script: "latin" },
  de: { code: "de", englishName: "German", nativeName: "Deutsch", launchTier: "seed", script: "latin" },
  ru: { code: "ru", englishName: "Russian", nativeName: "Русский", launchTier: "seed", script: "cyrillic" }
};

export const productStages = [
  {
    id: 1,
    slug: "immersion",
    label: "Immersion",
    userStep: 1,
    purpose: "Build unconscious familiarity through context-rich audio/video input.",
    mvp: true
  },
  {
    id: 2,
    slug: "literacy-sounds",
    label: "Literacy & Sounds",
    userStep: 2,
    purpose: "Map sounds to symbols, scripts, pronunciation, and basic decoding.",
    mvp: true
  },
  {
    id: 3,
    slug: "core-vocabulary",
    label: "Core Vocabulary",
    userStep: 2,
    purpose: "Acquire high-frequency words and lexical chunks in context.",
    mvp: true
  },
  {
    id: 4,
    slug: "sentence-production",
    label: "Simple Sentence Production",
    userStep: 3,
    purpose: "Read, write, and speak simple sentences about familiar scenes.",
    mvp: "beta"
  },
  {
    id: 5,
    slug: "dictionary-reference",
    label: "Dictionary & Reference Skills",
    userStep: 4,
    purpose: "Use dictionaries, collocations, register, and references independently.",
    mvp: false
  },
  {
    id: 6,
    slug: "grammar-figures",
    label: "Grammar & Figures of Speech",
    userStep: 4,
    purpose: "Discover higher-order grammar, parts of speech, idioms, and figurative language.",
    mvp: false
  },
  {
    id: 7,
    slug: "comprehension-tests",
    label: "Comprehension Tests",
    userStep: 5,
    purpose: "Measure reading, listening, and viewing comprehension across registers.",
    mvp: false
  },
  {
    id: 8,
    slug: "composition-tests",
    label: "Lexis, Structure & Composition",
    userStep: 5,
    purpose: "Assess vocabulary range, syntax, structure, and composition quality.",
    mvp: false
  }
] as const;

export type ProductStage = (typeof productStages)[number];

export const languageCodeSchema = z.enum(languageCodes);
export const stageSlugSchema = z.enum(productStages.map((stage) => stage.slug) as [ProductStage["slug"], ...ProductStage["slug"][]]);

export const lessonStatusSchema = z.enum(["draft", "in_review", "published", "archived"]);
export type LessonStatus = z.infer<typeof lessonStatusSchema>;

export const contentKindSchema = z.enum([
  "movie_recommendation",
  "micro_story",
  "dialogue",
  "vocabulary_card",
  "minimal_pair",
  "sentence_prompt",
  "comprehension_question",
  "composition_prompt"
]);
export type ContentKind = z.infer<typeof contentKindSchema>;
