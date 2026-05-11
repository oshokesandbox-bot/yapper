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
export type StageSlug = ProductStage["slug"];

export const languageCodeSchema = z.enum(languageCodes);
export const stageSlugSchema = z.enum(productStages.map((stage) => stage.slug) as [StageSlug, ...StageSlug[]]);

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

export type LessonStep =
  | {
      id: string;
      type: "immersion";
      title: string;
      mediaTitle: string;
      mediaType: "movie" | "short" | "song";
      instruction: string;
      watchUrl?: string | undefined;
      focus: string[];
    }
  | {
      id: string;
      type: "vocabulary";
      title: string;
      cards: Array<{ term: string; translation: string; concept: string; pronunciationHint: string }>;
    }
  | {
      id: string;
      type: "story";
      title: string;
      text: string;
      glossary: Array<{ term: string; translation: string }>;
    }
  | {
      id: string;
      type: "quiz";
      title: string;
      prompt: string;
      options: string[];
      answer: string;
      explanation: string;
    };

export type Lesson = {
  id: string;
  language: LanguageCode;
  stageSlug: StageSlug;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  status: "published" | "seed";
  steps: LessonStep[];
};

export type MediaRecommendation = {
  id: string;
  language: LanguageCode;
  title: string;
  mediaType: "movie" | "series" | "book" | "music";
  stageSlug: StageSlug;
  reason: string;
  challenge: string;
  affiliateUrl?: string;
};

const sharedVocabulary: Record<LanguageCode, Array<{ term: string; translation: string; concept: string; pronunciationHint: string }>> = {
  es: [
    { term: "hola", translation: "hello", concept: "greeting", pronunciationHint: "OH-lah" },
    { term: "agua", translation: "water", concept: "drink", pronunciationHint: "AH-gwah" },
    { term: "casa", translation: "house", concept: "place", pronunciationHint: "KAH-sah" },
    { term: "gato", translation: "cat", concept: "animal", pronunciationHint: "GAH-toh" }
  ],
  fr: [
    { term: "bonjour", translation: "hello", concept: "greeting", pronunciationHint: "bohn-ZHOOR" },
    { term: "eau", translation: "water", concept: "drink", pronunciationHint: "oh" },
    { term: "maison", translation: "house", concept: "place", pronunciationHint: "meh-ZON" },
    { term: "chat", translation: "cat", concept: "animal", pronunciationHint: "shah" }
  ],
  en: [
    { term: "hello", translation: "greeting", concept: "greeting", pronunciationHint: "heh-LOH" },
    { term: "water", translation: "drink", concept: "drink", pronunciationHint: "WAH-ter" },
    { term: "house", translation: "place", concept: "place", pronunciationHint: "hows" },
    { term: "cat", translation: "animal", concept: "animal", pronunciationHint: "kat" }
  ],
  de: [
    { term: "hallo", translation: "hello", concept: "greeting", pronunciationHint: "HAH-loh" },
    { term: "Wasser", translation: "water", concept: "drink", pronunciationHint: "VAH-ser" },
    { term: "Haus", translation: "house", concept: "place", pronunciationHint: "hows" },
    { term: "Katze", translation: "cat", concept: "animal", pronunciationHint: "KAT-suh" }
  ],
  ru: [
    { term: "привет", translation: "hello", concept: "greeting", pronunciationHint: "pree-VYET" },
    { term: "вода", translation: "water", concept: "drink", pronunciationHint: "vah-DAH" },
    { term: "дом", translation: "house", concept: "place", pronunciationHint: "dohm" },
    { term: "кот", translation: "cat", concept: "animal", pronunciationHint: "koht" }
  ]
};

const immersionByLanguage: Record<LanguageCode, { title: string; mediaTitle: string; watchUrl?: string; focus: string[]; quizAnswer: string }> = {
  es: {
    title: "Spanish café immersion",
    mediaTitle: "A busy café scene",
    watchUrl: "https://www.youtube.com/results?search_query=spanish+cafe+scene+beginner",
    focus: ["Listen for greetings", "Watch gestures before guessing meaning", "Notice repeated words around ordering"],
    quizAnswer: "Someone orders a drink"
  },
  fr: {
    title: "French market immersion",
    mediaTitle: "A morning market exchange",
    watchUrl: "https://www.youtube.com/results?search_query=french+market+scene+beginner",
    focus: ["Listen for bonjour", "Notice pointing and object names", "Focus on rhythm, not translation"],
    quizAnswer: "People greet and buy food"
  },
  en: {
    title: "English family scene immersion",
    mediaTitle: "A simple family breakfast",
    watchUrl: "https://www.youtube.com/results?search_query=english+family+breakfast+scene+beginner",
    focus: ["Listen for everyday nouns", "Watch actions before words", "Notice question intonation"],
    quizAnswer: "A family talks at breakfast"
  },
  de: {
    title: "German train station immersion",
    mediaTitle: "A short station interaction",
    watchUrl: "https://www.youtube.com/results?search_query=german+train+station+dialogue+beginner",
    focus: ["Listen for hallo and danke", "Notice compound nouns on signs", "Do not pause for grammar yet"],
    quizAnswer: "Someone asks about travel"
  },
  ru: {
    title: "Russian shop immersion",
    mediaTitle: "A simple shop interaction",
    watchUrl: "https://www.youtube.com/results?search_query=russian+shop+dialogue+beginner",
    focus: ["Listen for привет", "Watch the object exchange", "Notice Cyrillic shapes in signs"],
    quizAnswer: "Someone buys something"
  }
};

const storyByLanguage: Record<LanguageCode, { title: string; text: string; glossary: Array<{ term: string; translation: string }> }> = {
  es: { title: "El gato y el sol", text: "El gato mira el sol. La casa está tranquila. El gato bebe agua y dice hola.", glossary: [{ term: "mira", translation: "looks" }, { term: "tranquila", translation: "quiet" }] },
  fr: { title: "Le chat et le soleil", text: "Le chat regarde le soleil. La maison est calme. Le chat boit de l'eau et dit bonjour.", glossary: [{ term: "regarde", translation: "looks" }, { term: "calme", translation: "calm" }] },
  en: { title: "The cat and the sun", text: "The cat looks at the sun. The house is quiet. The cat drinks water and says hello.", glossary: [{ term: "looks", translation: "directs eyes" }, { term: "quiet", translation: "not noisy" }] },
  de: { title: "Die Katze und die Sonne", text: "Die Katze sieht die Sonne. Das Haus ist ruhig. Die Katze trinkt Wasser und sagt hallo.", glossary: [{ term: "sieht", translation: "sees" }, { term: "ruhig", translation: "quiet" }] },
  ru: { title: "Кот и солнце", text: "Кот смотрит на солнце. Дом тихий. Кот пьёт воду и говорит привет.", glossary: [{ term: "смотрит", translation: "looks" }, { term: "тихий", translation: "quiet" }] }
};

export const seedLessons: Lesson[] = languageCodes.flatMap((language) => {
  const immersion = immersionByLanguage[language];
  const vocabulary = sharedVocabulary[language];
  const story = storyByLanguage[language];

  return [
    {
      id: `${language}-immersion-1`,
      language,
      stageSlug: "immersion",
      title: immersion.title,
      subtitle: "Watch first. Translate later. Let your ear collect patterns.",
      estimatedMinutes: 12,
      status: languages[language].launchTier === "mvp" ? "published" : "seed",
      steps: [
        {
          id: `${language}-immersion-watch`,
          type: "immersion",
          title: "No-subtitle watch challenge",
          mediaTitle: immersion.mediaTitle,
          mediaType: "short",
          instruction: "Open the suggested search, pick a short scene, and watch without subtitles. Your only goal is to infer what is happening from tone, gesture, and repetition.",
          watchUrl: immersion.watchUrl,
          focus: immersion.focus
        },
        {
          id: `${language}-immersion-quiz`,
          type: "quiz",
          title: "What happened?",
          prompt: "Based on the scene, what was most likely happening?",
          options: [immersion.quizAnswer, "Someone gives a formal speech", "Two people silently read a book"],
          answer: immersion.quizAnswer,
          explanation: "The goal is contextual understanding, not word-for-word translation. If you guessed from visuals and tone, you did the exercise correctly."
        }
      ]
    },
    {
      id: `${language}-vocabulary-1`,
      language,
      stageSlug: "core-vocabulary",
      title: `${languages[language].englishName} first concepts`,
      subtitle: "Connect words to ideas before memorizing grammar.",
      estimatedMinutes: 10,
      status: languages[language].launchTier === "mvp" ? "published" : "seed",
      steps: [
        {
          id: `${language}-vocab-cards`,
          type: "vocabulary",
          title: "Four anchor words",
          cards: vocabulary
        },
        {
          id: `${language}-vocab-quiz`,
          type: "quiz",
          title: "Concept check",
          prompt: `Which word is connected to “${vocabulary[1]?.concept ?? "drink"}”?`,
          options: vocabulary.map((card) => card.term),
          answer: vocabulary[1]?.term ?? vocabulary[0]?.term ?? "",
          explanation: "Yapper teaches vocabulary by concept first. You are mapping sound + symbol + meaning together."
        }
      ]
    },
    {
      id: `${language}-story-1`,
      language,
      stageSlug: "sentence-production",
      title: story.title,
      subtitle: "A tiny children’s-book style reader for simple sentence rhythm.",
      estimatedMinutes: 8,
      status: languages[language].launchTier === "mvp" ? "published" : "seed",
      steps: [
        {
          id: `${language}-story-read`,
          type: "story",
          title: story.title,
          text: story.text,
          glossary: story.glossary
        },
        {
          id: `${language}-story-quiz`,
          type: "quiz",
          title: "Story check",
          prompt: "Which object appears in the story?",
          options: [vocabulary[3]?.translation ?? "cat", "airplane", "mountain"],
          answer: vocabulary[3]?.translation ?? "cat",
          explanation: "Simple stories let you read for meaning without drowning in text."
        }
      ]
    }
  ];
});

export const seedRecommendations: MediaRecommendation[] = [
  { id: "es-coco", language: "es", title: "Coco", mediaType: "movie", stageSlug: "immersion", reason: "Strong visual storytelling and culturally relevant Spanish-language music/context.", challenge: "Watch one musical scene in Spanish with no subtitles, then describe the mood in one sentence." },
  { id: "fr-amelie", language: "fr", title: "Amélie", mediaType: "movie", stageSlug: "immersion", reason: "Iconic French cultural reference with expressive visual scenes.", challenge: "Watch a short café or street scene with no subtitles and identify the social situation." },
  { id: "en-paddington", language: "en", title: "Paddington", mediaType: "movie", stageSlug: "immersion", reason: "Clear family-friendly context, expressive scenes, and accessible everyday English.", challenge: "Watch a scene and list three actions you understood visually." },
  { id: "de-goodbye-lenin", language: "de", title: "Good Bye, Lenin!", mediaType: "movie", stageSlug: "immersion", reason: "Socially relevant German film with strong cultural context.", challenge: "Watch a short scene and focus only on greetings and emotional tone." },
  { id: "ru-cheburashka", language: "ru", title: "Cheburashka", mediaType: "movie", stageSlug: "immersion", reason: "Culturally familiar Russian media with visual humor and simple emotional cues.", challenge: "Watch a short clip and notice repeated sounds, names, and Cyrillic shapes." }
];

export function lessonsForLanguage(language: LanguageCode) {
  return seedLessons.filter((lesson) => lesson.language === language);
}

export function recommendationsForLanguage(language: LanguageCode) {
  return seedRecommendations.filter((recommendation) => recommendation.language === language);
}

export function getLessonById(id: string) {
  return seedLessons.find((lesson) => lesson.id === id);
}
