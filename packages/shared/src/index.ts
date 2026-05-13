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
  mediaType: "movie" | "series" | "book" | "music" | "podcast";
  stageSlug: StageSlug;
  reason: string;
  challenge: string;
  affiliateUrl?: string;
  stageHintId?: number;
  watchUrl?: string;
};

// ── Base content for lesson 1 of each category ──

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

// ── Immersion lesson 2 — Restaurant / ordering ──

const immersionByLanguage2: Record<LanguageCode, { title: string; mediaTitle: string; watchUrl?: string; focus: string[]; quizAnswer: string }> = {
  es: {
    title: "Spanish restaurant immersion",
    mediaTitle: "A restaurant ordering scene",
    watchUrl: "https://www.youtube.com/results?search_query=spanish+restaurant+ordering+beginner",
    focus: ["Listen for politeness words (por favor, gracias)", "Notice how the customer gets attention", "Watch the menu-pointing gesture"],
    quizAnswer: "A customer orders food at a restaurant"
  },
  fr: {
    title: "French restaurant immersion",
    mediaTitle: "A brasserie ordering scene",
    watchUrl: "https://www.youtube.com/results?search_query=french+restaurant+ordering+beginner",
    focus: ["Listen for s'il vous plaît", "Notice the greeting upon entering", "Watch how the server approaches"],
    quizAnswer: "Someone orders a meal in a restaurant"
  },
  en: {
    title: "English restaurant immersion",
    mediaTitle: "A diner ordering scene",
    watchUrl: "https://www.youtube.com/results?search_query=english+restaurant+ordering+dialogue+beginner",
    focus: ["Listen for polite requests", "Watch how people signal the server", "Notice question intonation for offers"],
    quizAnswer: "A customer places an order in a diner"
  },
  de: {
    title: "German restaurant immersion",
    mediaTitle: "A restaurant ordering scene",
    watchUrl: "https://www.youtube.com/results?search_query=german+restaurant+ordering+beginner",
    focus: ["Listen for bitte and danke", "Notice the formal Sie vs informal du", "Watch how the bill is requested"],
    quizAnswer: "Someone orders and pays at a restaurant"
  },
  ru: {
    title: "Russian restaurant immersion",
    mediaTitle: "A café ordering scene",
    watchUrl: "https://www.youtube.com/results?search_query=russian+restaurant+ordering+beginner",
    focus: ["Listen for здравствуйте and пожалуйста", "Notice the menu presentation", "Watch the payment interaction"],
    quizAnswer: "A customer orders at a café"
  }
};

// ── Immersion lesson 3 — Park / playground ──

const immersionByLanguage3: Record<LanguageCode, { title: string; mediaTitle: string; watchUrl?: string; focus: string[]; quizAnswer: string }> = {
  es: {
    title: "Spanish park immersion",
    mediaTitle: "A park playground scene",
    watchUrl: "https://www.youtube.com/results?search_query=spanish+park+playground+scene+beginner",
    focus: ["Listen for children's voices calling names", "Notice instructions from adults", "Watch the play-interaction cues"],
    quizAnswer: "Children play in a park while adults watch"
  },
  fr: {
    title: "French park immersion",
    mediaTitle: "A park bench conversation",
    watchUrl: "https://www.youtube.com/results?search_query=french+park+scene+beginner",
    focus: ["Listen for casual greetings (salut)", "Notice relaxed body language", "Focus on tone rather than every word"],
    quizAnswer: "Two friends meet and chat in a park"
  },
  en: {
    title: "English park immersion",
    mediaTitle: "A playground conversation",
    watchUrl: "https://www.youtube.com/results?search_query=english+park+playground+conversation+beginner",
    focus: ["Listen for short commands (come here, wait)", "Notice how parents call children", "Watch the action before speech"],
    quizAnswer: "Parents and children interact at a playground"
  },
  de: {
    title: "German park immersion",
    mediaTitle: "A park picnic scene",
    watchUrl: "https://www.youtube.com/results?search_query=german+park+picnic+scene+beginner",
    focus: ["Listen for komm and warte", "Notice the relaxed group dynamic", "Watch how people share food"],
    quizAnswer: "A group has a picnic in the park"
  },
  ru: {
    title: "Russian park immersion",
    mediaTitle: "A park walk scene",
    watchUrl: "https://www.youtube.com/results?search_query=russian+park+scene+beginner",
    focus: ["Listen for давай and пошли", "Notice people pointing at nature", "Watch how groups stay together"],
    quizAnswer: "People take a walk together in a park"
  }
};

// ── Immersion lesson 4 — Birthday party / celebration ──

const immersionByLanguage4: Record<LanguageCode, { title: string; mediaTitle: string; watchUrl?: string; focus: string[]; quizAnswer: string }> = {
  es: {
    title: "Spanish birthday party immersion",
    mediaTitle: "A birthday celebration",
    watchUrl: "https://www.youtube.com/results?search_query=spanish+birthday+party+scene+beginner",
    focus: ["Listen for ¡feliz cumpleaños!", "Notice the singing and clapping rhythm", "Watch how gifts are given and received"],
    quizAnswer: "A group celebrates someone's birthday"
  },
  fr: {
    title: "French birthday party immersion",
    mediaTitle: "A birthday gathering",
    watchUrl: "https://www.youtube.com/results?search_query=french+birthday+party+scene+beginner",
    focus: ["Listen for joyeux anniversaire", "Notice cheek-kissing greetings", "Watch the cake presentation"],
    quizAnswer: "People celebrate a birthday together"
  },
  en: {
    title: "English birthday party immersion",
    mediaTitle: "A birthday celebration scene",
    watchUrl: "https://www.youtube.com/results?search_query=english+birthday+party+scene+beginner",
    focus: ["Listen for happy birthday singing", "Notice excited tone of congratulations", "Watch how gifts are handed over"],
    quizAnswer: "A birthday party with singing and presents"
  },
  de: {
    title: "German birthday party immersion",
    mediaTitle: "A birthday celebration",
    watchUrl: "https://www.youtube.com/results?search_query=german+birthday+party+scene+beginner",
    focus: ["Listen for alles Gute zum Geburtstag", "Notice the formal vs informal greetings", "Watch how toasts are made"],
    quizAnswer: "A birthday celebration with friends and family"
  },
  ru: {
    title: "Russian birthday party immersion",
    mediaTitle: "A birthday celebration",
    watchUrl: "https://www.youtube.com/results?search_query=russian+birthday+party+scene+beginner",
    focus: ["Listen for с днём рождения", "Notice the toast-making ritual", "Watch how presents are offered"],
    quizAnswer: "A birthday celebration with toasts and gifts"
  }
};

// ── Vocabulary 2 — Food & Drink ──

const vocabularyByLanguage2: Record<LanguageCode, Array<{ term: string; translation: string; concept: string; pronunciationHint: string }>> = {
  es: [
    { term: "pan", translation: "bread", concept: "food", pronunciationHint: "pahn" },
    { term: "leche", translation: "milk", concept: "drink", pronunciationHint: "LEH-cheh" },
    { term: "manzana", translation: "apple", concept: "fruit", pronunciationHint: "mahn-SAH-nah" },
    { term: "arroz", translation: "rice", concept: "food", pronunciationHint: "ah-ROHS" },
    { term: "pollo", translation: "chicken", concept: "food", pronunciationHint: "POH-yoh" },
    { term: "jugo", translation: "juice", concept: "drink", pronunciationHint: "HOO-goh" }
  ],
  fr: [
    { term: "pain", translation: "bread", concept: "food", pronunciationHint: "pan" },
    { term: "lait", translation: "milk", concept: "drink", pronunciationHint: "leh" },
    { term: "pomme", translation: "apple", concept: "fruit", pronunciationHint: "pohm" },
    { term: "riz", translation: "rice", concept: "food", pronunciationHint: "ree" },
    { term: "poulet", translation: "chicken", concept: "food", pronunciationHint: "poo-LEH" },
    { term: "jus", translation: "juice", concept: "drink", pronunciationHint: "zhoo" }
  ],
  en: [
    { term: "bread", translation: "baked food from flour", concept: "food", pronunciationHint: "bred" },
    { term: "milk", translation: "white drink from cows", concept: "drink", pronunciationHint: "milk" },
    { term: "apple", translation: "round red fruit", concept: "fruit", pronunciationHint: "AP-ul" },
    { term: "rice", translation: "small white grains", concept: "food", pronunciationHint: "ryce" },
    { term: "chicken", translation: "common poultry meat", concept: "food", pronunciationHint: "CHIK-en" },
    { term: "juice", translation: "liquid from fruit", concept: "drink", pronunciationHint: "jooss" }
  ],
  de: [
    { term: "Brot", translation: "bread", concept: "food", pronunciationHint: "broht" },
    { term: "Milch", translation: "milk", concept: "drink", pronunciationHint: "milch" },
    { term: "Apfel", translation: "apple", concept: "fruit", pronunciationHint: "AP-fel" },
    { term: "Reis", translation: "rice", concept: "food", pronunciationHint: "ryce" },
    { term: "Hähnchen", translation: "chicken", concept: "food", pronunciationHint: "HAYN-chen" },
    { term: "Saft", translation: "juice", concept: "drink", pronunciationHint: "zaft" }
  ],
  ru: [
    { term: "хлеб", translation: "bread", concept: "food", pronunciationHint: "khlyep" },
    { term: "молоко", translation: "milk", concept: "drink", pronunciationHint: "moh-lah-KOH" },
    { term: "яблоко", translation: "apple", concept: "fruit", pronunciationHint: "YAH-blah-koh" },
    { term: "рис", translation: "rice", concept: "food", pronunciationHint: "rees" },
    { term: "курица", translation: "chicken", concept: "food", pronunciationHint: "KOO-ree-tsah" },
    { term: "сок", translation: "juice", concept: "drink", pronunciationHint: "sok" }
  ]
};

// ── Vocabulary 3 — Family & People ──

const vocabularyByLanguage3: Record<LanguageCode, Array<{ term: string; translation: string; concept: string; pronunciationHint: string }>> = {
  es: [
    { term: "madre", translation: "mother", concept: "family", pronunciationHint: "MAH-dreh" },
    { term: "padre", translation: "father", concept: "family", pronunciationHint: "PAH-dreh" },
    { term: "hermano", translation: "brother", concept: "family", pronunciationHint: "ehr-MAH-noh" },
    { term: "hermana", translation: "sister", concept: "family", pronunciationHint: "ehr-MAH-nah" },
    { term: "bebé", translation: "baby", concept: "family", pronunciationHint: "beh-BEH" },
    { term: "amigo", translation: "friend", concept: "people", pronunciationHint: "ah-MEE-goh" }
  ],
  fr: [
    { term: "mère", translation: "mother", concept: "family", pronunciationHint: "mehr" },
    { term: "père", translation: "father", concept: "family", pronunciationHint: "pehr" },
    { term: "frère", translation: "brother", concept: "family", pronunciationHint: "frehr" },
    { term: "soeur", translation: "sister", concept: "family", pronunciationHint: "suhr" },
    { term: "bébé", translation: "baby", concept: "family", pronunciationHint: "beh-BEH" },
    { term: "ami", translation: "friend", concept: "people", pronunciationHint: "ah-MEE" }
  ],
  en: [
    { term: "mother", translation: "female parent", concept: "family", pronunciationHint: "MUTH-er" },
    { term: "father", translation: "male parent", concept: "family", pronunciationHint: "FAH-ther" },
    { term: "brother", translation: "male sibling", concept: "family", pronunciationHint: "BROTH-er" },
    { term: "sister", translation: "female sibling", concept: "family", pronunciationHint: "SIS-ter" },
    { term: "baby", translation: "very young child", concept: "family", pronunciationHint: "BAY-bee" },
    { term: "friend", translation: "close companion", concept: "people", pronunciationHint: "frend" }
  ],
  de: [
    { term: "Mutter", translation: "mother", concept: "family", pronunciationHint: "MOOT-er" },
    { term: "Vater", translation: "father", concept: "family", pronunciationHint: "FAH-ter" },
    { term: "Bruder", translation: "brother", concept: "family", pronunciationHint: "BROO-der" },
    { term: "Schwester", translation: "sister", concept: "family", pronunciationHint: "SHVES-ter" },
    { term: "Baby", translation: "baby", concept: "family", pronunciationHint: "BAY-bee" },
    { term: "Freund", translation: "friend", concept: "people", pronunciationHint: "froynd" }
  ],
  ru: [
    { term: "мама", translation: "mother", concept: "family", pronunciationHint: "MAH-mah" },
    { term: "папа", translation: "father", concept: "family", pronunciationHint: "PAH-pah" },
    { term: "брат", translation: "brother", concept: "family", pronunciationHint: "braht" },
    { term: "сестра", translation: "sister", concept: "family", pronunciationHint: "sees-TRAH" },
    { term: "ребёнок", translation: "baby/child", concept: "family", pronunciationHint: "ree-BYOH-nok" },
    { term: "друг", translation: "friend", concept: "people", pronunciationHint: "droog" }
  ]
};

// ── Vocabulary 4 — Colors & Numbers ──

const vocabularyByLanguage4: Record<LanguageCode, Array<{ term: string; translation: string; concept: string; pronunciationHint: string }>> = {
  es: [
    { term: "rojo", translation: "red", concept: "color", pronunciationHint: "ROH-hoh" },
    { term: "azul", translation: "blue", concept: "color", pronunciationHint: "ah-SOOL" },
    { term: "verde", translation: "green", concept: "color", pronunciationHint: "VEHR-deh" },
    { term: "uno", translation: "one", concept: "number", pronunciationHint: "OO-noh" },
    { term: "dos", translation: "two", concept: "number", pronunciationHint: "dohs" },
    { term: "tres", translation: "three", concept: "number", pronunciationHint: "trehs" }
  ],
  fr: [
    { term: "rouge", translation: "red", concept: "color", pronunciationHint: "roozh" },
    { term: "bleu", translation: "blue", concept: "color", pronunciationHint: "bluh" },
    { term: "vert", translation: "green", concept: "color", pronunciationHint: "vehr" },
    { term: "un", translation: "one", concept: "number", pronunciationHint: "uhn" },
    { term: "deux", translation: "two", concept: "number", pronunciationHint: "duh" },
    { term: "trois", translation: "three", concept: "number", pronunciationHint: "trwah" }
  ],
  en: [
    { term: "red", translation: "color of fire", concept: "color", pronunciationHint: "red" },
    { term: "blue", translation: "color of sky", concept: "color", pronunciationHint: "bloo" },
    { term: "green", translation: "color of grass", concept: "color", pronunciationHint: "green" },
    { term: "one", translation: "the number 1", concept: "number", pronunciationHint: "wun" },
    { term: "two", translation: "the number 2", concept: "number", pronunciationHint: "too" },
    { term: "three", translation: "the number 3", concept: "number", pronunciationHint: "three" }
  ],
  de: [
    { term: "rot", translation: "red", concept: "color", pronunciationHint: "roht" },
    { term: "blau", translation: "blue", concept: "color", pronunciationHint: "blow" },
    { term: "grün", translation: "green", concept: "color", pronunciationHint: "groon" },
    { term: "eins", translation: "one", concept: "number", pronunciationHint: "eyens" },
    { term: "zwei", translation: "two", concept: "number", pronunciationHint: "tsvy" },
    { term: "drei", translation: "three", concept: "number", pronunciationHint: "dry" }
  ],
  ru: [
    { term: "красный", translation: "red", concept: "color", pronunciationHint: "KRAS-ny" },
    { term: "синий", translation: "blue", concept: "color", pronunciationHint: "SEE-ny" },
    { term: "зелёный", translation: "green", concept: "color", pronunciationHint: "zee-LYOH-ny" },
    { term: "один", translation: "one", concept: "number", pronunciationHint: "ah-DEEN" },
    { term: "два", translation: "two", concept: "number", pronunciationHint: "dvah" },
    { term: "три", translation: "three", concept: "number", pronunciationHint: "tree" }
  ]
};

// ── Story 2 — The dog and the ball ──

const storyByLanguage2: Record<LanguageCode, { title: string; text: string; glossary: Array<{ term: string; translation: string }> }> = {
  es: { title: "El perro y la pelota", text: "El perro corre. Ve una pelota roja. Salta y juega. ¡Qué divertido!", glossary: [{ term: "perro", translation: "dog" }, { term: "pelota", translation: "ball" }, { term: "salta", translation: "jumps" }, { term: "divertido", translation: "fun" }] },
  fr: { title: "Le chien et la balle", text: "Le chien court. Il voit une balle rouge. Il saute et joue. Quel amusement!", glossary: [{ term: "chien", translation: "dog" }, { term: "balle", translation: "ball" }, { term: "saute", translation: "jumps" }, { term: "amusement", translation: "fun" }] },
  en: { title: "The dog and the ball", text: "The dog runs. He sees a red ball. He jumps and plays. So much fun!", glossary: [{ term: "runs", translation: "moves fast on feet" }, { term: "ball", translation: "round toy" }, { term: "jumps", translation: "springs into air" }, { term: "fun", translation: "enjoyable activity" }] },
  de: { title: "Der Hund und der Ball", text: "Der Hund rennt. Er sieht einen roten Ball. Er springt und spielt. So ein Spaß!", glossary: [{ term: "Hund", translation: "dog" }, { term: "Ball", translation: "ball" }, { term: "springt", translation: "jumps" }, { term: "Spaß", translation: "fun" }] },
  ru: { title: "Собака и мяч", text: "Собака бежит. Она видит красный мяч. Она прыгает и играет. Как весело!", glossary: [{ term: "собака", translation: "dog" }, { term: "мяч", translation: "ball" }, { term: "прыгает", translation: "jumps" }, { term: "весело", translation: "fun" }] }
};

// ── Story 3 — Morning routine ──

const storyByLanguage3: Record<LanguageCode, { title: string; text: string; glossary: Array<{ term: string; translation: string }> }> = {
  es: { title: "La mañana", text: "El sol sale. La familia se levanta. El niño come pan. Todos dicen buenos días.", glossary: [{ term: "sale", translation: "rises" }, { term: "se levanta", translation: "gets up" }, { term: "niño", translation: "child" }, { term: "buenos días", translation: "good morning" }] },
  fr: { title: "Le matin", text: "Le soleil se lève. La famille se réveille. L'enfant mange du pain. Tout le monde dit bonjour.", glossary: [{ term: "se lève", translation: "rises" }, { term: "se réveille", translation: "wakes up" }, { term: "enfant", translation: "child" }, { term: "bonjour", translation: "good morning" }] },
  en: { title: "The morning", text: "The sun rises. The family wakes up. The child eats bread. Everyone says good morning.", glossary: [{ term: "rises", translation: "comes up" }, { term: "wakes up", translation: "stops sleeping" }, { term: "child", translation: "young person" }, { term: "good morning", translation: "morning greeting" }] },
  de: { title: "Der Morgen", text: "Die Sonne geht auf. Die Familie wacht auf. Das Kind isst Brot. Alle sagen guten Morgen.", glossary: [{ term: "geht auf", translation: "rises" }, { term: "wacht auf", translation: "wakes up" }, { term: "Kind", translation: "child" }, { term: "guten Morgen", translation: "good morning" }] },
  ru: { title: "Утро", text: "Солнце встаёт. Семья просыпается. Ребёнок ест хлеб. Все говорят доброе утро.", glossary: [{ term: "встаёт", translation: "rises" }, { term: "просыпается", translation: "wakes up" }, { term: "ребёнок", translation: "child" }, { term: "доброе утро", translation: "good morning" }] }
};

// ── Story 4 — Rain / weather ──

const storyByLanguage4: Record<LanguageCode, { title: string; text: string; glossary: Array<{ term: string; translation: string }> }> = {
  es: { title: "La lluvia", text: "Nubes grises. Cae la lluvia. El gato mira por la ventana. La casa está caliente.", glossary: [{ term: "nubes", translation: "clouds" }, { term: "lluvia", translation: "rain" }, { term: "ventana", translation: "window" }, { term: "caliente", translation: "warm" }] },
  fr: { title: "La pluie", text: "Des nuages gris. La pluie tombe. Le chat regarde par la fenêtre. La maison est chaude.", glossary: [{ term: "nuages", translation: "clouds" }, { term: "pluie", translation: "rain" }, { term: "fenêtre", translation: "window" }, { term: "chaude", translation: "warm" }] },
  en: { title: "The rain", text: "Gray clouds. Rain falls. The cat looks through the window. The house is warm.", glossary: [{ term: "clouds", translation: "white/gray things in the sky" }, { term: "rain", translation: "water falling from sky" }, { term: "window", translation: "glass opening in wall" }, { term: "warm", translation: "a little hot, cozy" }] },
  de: { title: "Der Regen", text: "Graue Wolken. Der Regen fällt. Die Katze schaut durch das Fenster. Das Haus ist warm.", glossary: [{ term: "Wolken", translation: "clouds" }, { term: "Regen", translation: "rain" }, { term: "Fenster", translation: "window" }, { term: "warm", translation: "warm" }] },
  ru: { title: "Дождь", text: "Серые облака. Идёт дождь. Кот смотрит в окно. В доме тепло.", glossary: [{ term: "облака", translation: "clouds" }, { term: "дождь", translation: "rain" }, { term: "окно", translation: "window" }, { term: "тепло", translation: "warm" }] }
};

// ── Literacy / Sounds — Latin script languages (es, fr, en, de) ──

type LiteracyLessonSet = {
  literacy1: {
    title: string;
    subtitle: string;
    steps: LessonStep[];
  };
  literacy2: {
    title: string;
    subtitle: string;
    steps: LessonStep[];
  };
};

const literacyLatinByLanguage: Partial<Record<LanguageCode, LiteracyLessonSet>> = {
  es: {
    literacy1: {
      title: "Spanish alphabet and vowels",
      subtitle: "Connect each vowel sound to its symbol.",
      steps: [
        {
          id: "es-lit-vowels",
          type: "vocabulary",
          title: "Spanish vowels (a, e, i, o, u)",
          cards: [
            { term: "a", translation: "a (as in 'casa')", concept: "vowel", pronunciationHint: "AH" },
            { term: "e", translation: "e (as in 'mesa')", concept: "vowel", pronunciationHint: "EH" },
            { term: "i", translation: "i (as in 'silla')", concept: "vowel", pronunciationHint: "EE" },
            { term: "o", translation: "o (as in 'sol')", concept: "vowel", pronunciationHint: "OH" },
            { term: "u", translation: "u (as in 'luna')", concept: "vowel", pronunciationHint: "OO" }
          ]
        },
        {
          id: "es-lit-vowel-quiz",
          type: "quiz",
          title: "Vowel sound match",
          prompt: "Which Spanish vowel sounds like 'EH'?",
          options: ["a", "e", "i", "o", "u"],
          answer: "e",
          explanation: "Spanish vowels are pure and consistent — each letter always makes the same sound."
        }
      ]
    },
    literacy2: {
      title: "Spanish sound pairs",
      subtitle: "Train your ear to hear subtle differences.",
      steps: [
        {
          id: "es-lit-pairs",
          type: "vocabulary",
          title: "Minimal pairs: B vs V",
          cards: [
            { term: "bota", translation: "boot", concept: "minimal pair", pronunciationHint: "BOH-tah" },
            { term: "vota", translation: "votes", concept: "minimal pair", pronunciationHint: "BOH-tah" },
            { term: "bello", translation: "beautiful", concept: "minimal pair", pronunciationHint: "BEH-yoh" },
            { term: "vello", translation: "body hair", concept: "minimal pair", pronunciationHint: "BEH-yoh" }
          ]
        },
        {
          id: "es-lit-pairs-quiz",
          type: "quiz",
          title: "Hear the difference",
          prompt: "In Spanish, 'bota' and 'vota' sound:",
          options: ["Exactly the same", "Slightly different — B and V are pronounced the same in Spanish", "Completely different"],
          answer: "Slightly different — B and V are pronounced the same in Spanish",
          explanation: "In most Spanish dialects, B and V are pronounced identically. Context tells you which word it is."
        }
      ]
    }
  },
  fr: {
    literacy1: {
      title: "French alphabet and nasal vowels",
      subtitle: "Learn the vowel sounds that make French unique.",
      steps: [
        {
          id: "fr-lit-vowels",
          type: "vocabulary",
          title: "French vowel sounds",
          cards: [
            { term: "a", translation: "a (as in 'chat')", concept: "vowel", pronunciationHint: "ah" },
            { term: "e", translation: "e (as in 'le')", concept: "vowel", pronunciationHint: "uh" },
            { term: "é", translation: "é (as in 'café')", concept: "vowel", pronunciationHint: "ay" },
            { term: "i", translation: "i (as in 'lit')", concept: "vowel", pronunciationHint: "ee" },
            { term: "ou", translation: "ou (as in 'loup')", concept: "vowel combination", pronunciationHint: "oo" },
            { term: "on", translation: "nasal on (as in 'bon')", concept: "nasal vowel", pronunciationHint: "ohn" }
          ]
        },
        {
          id: "fr-lit-vowel-quiz",
          type: "quiz",
          title: "Nasal or not?",
          prompt: "Which word has a nasal vowel?",
          options: ["lit", "pain", "chat", "café"],
          answer: "pain",
          explanation: "French has nasal vowels (an, en, in, on, un) that don't exist in English. They push air through the nose."
        }
      ]
    },
    literacy2: {
      title: "French silent letters",
      subtitle: "Spot the letters you don't pronounce.",
      steps: [
        {
          id: "fr-lit-silent",
          type: "vocabulary",
          title: "Common silent endings",
          cards: [
            { term: "parle", translation: "speaks", concept: "silent e", pronunciationHint: "parl" },
            { term: "petit", translation: "small", concept: "silent t", pronunciationHint: "puh-TEE" },
            { term: "grand", translation: "big", concept: "silent d", pronunciationHint: "grahn" },
            { term: "vous", translation: "you (formal)", concept: "silent s", pronunciationHint: "voo" },
            { term: "temps", translation: "time/weather", concept: "silent p+s", pronunciationHint: "tahn" }
          ]
        },
        {
          id: "fr-lit-silent-quiz",
          type: "quiz",
          title: "Spot the silent letter",
          prompt: "In the French word 'petit', which letter is silent?",
          options: ["p", "t", "e", "i"],
          answer: "t",
          explanation: "Most final consonants in French are not pronounced. The t in 'petit' is silent — say puh-TEE."
        }
      ]
    }
  },
  en: {
    literacy1: {
      title: "English letter sounds",
      subtitle: "English letters can make more than one sound — start with the basics.",
      steps: [
        {
          id: "en-lit-sounds",
          type: "vocabulary",
          title: "Key English vowel sounds",
          cards: [
            { term: "a", translation: "a (as in 'cat')", concept: "short vowel", pronunciationHint: "a" },
            { term: "a_e", translation: "a (as in 'cake')", concept: "long vowel", pronunciationHint: "ay" },
            { term: "ee", translation: "ee (as in 'see')", concept: "vowel digraph", pronunciationHint: "ee" },
            { term: "sh", translation: "sh (as in 'ship')", concept: "consonant digraph", pronunciationHint: "sh" },
            { term: "th", translation: "th (as in 'this')", concept: "consonant digraph", pronunciationHint: "th" }
          ]
        },
        {
          id: "en-lit-sounds-quiz",
          type: "quiz",
          title: "Two letters, one sound",
          prompt: "Which pair of letters makes the SH sound?",
          options: ["ch", "sh", "th", "wh"],
          answer: "sh",
          explanation: "In English, 'sh' is a digraph — two letters that combine to make one new sound."
        }
      ]
    },
    literacy2: {
      title: "English minimal pairs",
      subtitle: "Hear the difference between tricky sounds.",
      steps: [
        {
          id: "en-lit-th",
          type: "vocabulary",
          title: "TH sounds — voiced vs unvoiced",
          cards: [
            { term: "think", translation: "to have a thought", concept: "unvoiced th", pronunciationHint: "think" },
            { term: "this", translation: "the thing here", concept: "voiced th", pronunciationHint: "this" },
            { term: "thin", translation: "not thick", concept: "unvoiced th", pronunciationHint: "thin" },
            { term: "then", translation: "at that time", concept: "voiced th", pronunciationHint: "then" }
          ]
        },
        {
          id: "en-lit-th-quiz",
          type: "quiz",
          title: "Which TH?",
          prompt: "Listen to your inner voice: which word has a voiced TH (vibration in the throat)?",
          options: ["think", "thin", "this", "thick"],
          answer: "this",
          explanation: "Put your hand on your throat. For 'this', you feel vibration (voiced). For 'think', you don't (unvoiced)."
        }
      ]
    }
  },
  de: {
    literacy1: {
      title: "German letter sounds",
      subtitle: "German spelling is very consistent — once you know the rules.",
      steps: [
        {
          id: "de-lit-sounds",
          type: "vocabulary",
          title: "Key German letters",
          cards: [
            { term: "ß", translation: "sharp s (as in 'Fuß')", concept: "special letter", pronunciationHint: "ss" },
            { term: "ch", translation: "ch (as in 'ich')", concept: "digraph", pronunciationHint: "ikh" },
            { term: "sch", translation: "sch (as in 'Schule')", concept: "digraph", pronunciationHint: "sh" },
            { term: "ei", translation: "ei (as in 'Eis')", concept: "diphthong", pronunciationHint: "eye" },
            { term: "au", translation: "au (as in 'Haus')", concept: "diphthong", pronunciationHint: "ow" },
            { term: "ü", translation: "ü (as in 'über')", concept: "umlaut", pronunciationHint: "oo (with rounded lips)" }
          ]
        },
        {
          id: "de-lit-sounds-quiz",
          type: "quiz",
          title: "German sound match",
          prompt: "The German digraph 'ei' sounds like which English word?",
          options: ["eye", "ay (as in 'say')", "ee (as in 'see')", "ow (as in 'cow')"],
          answer: "eye",
          explanation: "German 'ei' is pronounced like English 'eye' (as in 'Eis' = ice, 'mein' = my)."
        }
      ]
    },
    literacy2: {
      title: "German umlauts",
      subtitle: "Those dots change everything.",
      steps: [
        {
          id: "de-lit-umlaut",
          type: "vocabulary",
          title: "Umlaut pairs",
          cards: [
            { term: "a / ä", translation: "a vs ä (as in 'Apfel' / 'Äpfel')", concept: "umlaut change", pronunciationHint: "ah / eh" },
            { term: "o / ö", translation: "o vs ö (as in 'offen' / 'öffnen')", concept: "umlaut change", pronunciationHint: "oh / uhr" },
            { term: "u / ü", translation: "u vs ü (as in 'Hund' / 'Hündin')", concept: "umlaut change", pronunciationHint: "oo / uu (rounded)" }
          ]
        },
        {
          id: "de-lit-umlaut-quiz",
          type: "quiz",
          title: "Umlaut effect",
          prompt: "What does adding an umlaut (dots) to a German vowel do?",
          options: [
            "Makes the letter uppercase",
            "Changes the vowel sound completely",
            "Makes it silent",
            "Changes the grammar"
          ],
          answer: "Changes the vowel sound completely",
          explanation: "Umlauts (ä, ö, ü) are distinct vowels — they change both the sound and often the meaning of a word."
        }
      ]
    }
  }
};

// ── Literacy / Sounds — Cyrillic (Russian) ──

const literacyRussian: { literacy1: { title: string; subtitle: string; steps: LessonStep[] }; literacy2: { title: string; subtitle: string; steps: LessonStep[] } } = {
  literacy1: {
    title: "Russian alphabet — first letters",
    subtitle: "Start with 6 letters that look familiar to Latin readers.",
    steps: [
      {
        id: "ru-lit-letters-1",
        type: "vocabulary",
        title: "First Cyrillic letters (А, Б, В, Г, Д, Е)",
        cards: [
          { term: "А а", translation: "A (as in 'автобус' — bus)", concept: "letter A", pronunciationHint: "ah" },
          { term: "Б б", translation: "B (as in 'банк' — bank)", concept: "letter B", pronunciationHint: "b" },
          { term: "В в", translation: "V (as in 'вода' — water)", concept: "letter V", pronunciationHint: "v" },
          { term: "Г г", translation: "G (as in 'город' — city)", concept: "letter G", pronunciationHint: "g" },
          { term: "Д д", translation: "D (as in 'дом' — house)", concept: "letter D", pronunciationHint: "d" },
          { term: "Е е", translation: "Ye (as in 'еда' — food)", concept: "letter E", pronunciationHint: "yeh" }
        ]
      },
      {
        id: "ru-lit-quiz-1",
        type: "quiz",
        title: "Which letter is which?",
        prompt: "The Cyrillic letter 'В' looks like a B but sounds like which English letter?",
        options: ["B", "V", "W", "F"],
        answer: "V",
        explanation: "Cyrillic 'В' is the V sound — this is a common trap for beginners because it looks like a capital B."
      }
    ]
  },
  literacy2: {
    title: "Russian alphabet — more letters",
    subtitle: "Continue with tricky-looking letters.",
    steps: [
      {
        id: "ru-lit-letters-2",
        type: "vocabulary",
        title: "Next letters (Ё, Ж, З, И, Й, К)",
        cards: [
          { term: "Ё ё", translation: "Yo (as in 'ёлка' — fir tree)", concept: "letter YO", pronunciationHint: "yoh" },
          { term: "Ж ж", translation: "Zh (as in 'жук' — beetle)", concept: "letter ZH", pronunciationHint: "zh" },
          { term: "З з", translation: "Z (as in 'замок' — castle)", concept: "letter Z", pronunciationHint: "z" },
          { term: "И и", translation: "I (as in 'игра' — game)", concept: "letter I", pronunciationHint: "ee" },
          { term: "Й й", translation: "short Y (as in 'чай' — tea)", concept: "letter Y", pronunciationHint: "y" },
          { term: "К к", translation: "K (as in 'кот' — cat)", concept: "letter K", pronunciationHint: "k" }
        ]
      },
      {
        id: "ru-lit-quiz-2",
        type: "quiz",
        title: "Read a real word",
        prompt: "Using these letters, how would you read the Russian word 'кот'?",
        options: ["kot", "kat", "kote", "coat"],
        answer: "kot",
        explanation: "К=K, О=O, Т=T. Russian is read as written — no surprise sounds."
      }
    ]
  }
};

// ── seed lessons ──

export const seedLessons: Lesson[] = languageCodes.flatMap((language) => {
  const immersion = immersionByLanguage[language];
  const vocabulary = sharedVocabulary[language];
  const story = storyByLanguage[language];
  const immersion2 = immersionByLanguage2[language];
  const immersion3 = immersionByLanguage3[language];
  const immersion4 = immersionByLanguage4[language];
  const vocab2 = vocabularyByLanguage2[language];
  const vocab3 = vocabularyByLanguage3[language];
  const vocab4 = vocabularyByLanguage4[language];
  const story2 = storyByLanguage2[language];
  const story3 = storyByLanguage3[language];
  const story4 = storyByLanguage4[language];

  const isMvp = languages[language].launchTier === "mvp";

  const lessons: Lesson[] = [
    // ── Lesson 1 — existing ──
    {
      id: `${language}-immersion-1`,
      language,
      stageSlug: "immersion",
      title: immersion.title,
      subtitle: "Watch first. Translate later. Let your ear collect patterns.",
      estimatedMinutes: 12,
      status: isMvp ? "published" : "seed",
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
      status: isMvp ? "published" : "seed",
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
      status: isMvp ? "published" : "seed",
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

  // ── Lesson 2 — Immersion (restaurant) — all languages ──
  lessons.push({
    id: `${language}-immersion-2`,
    language,
    stageSlug: "immersion",
    title: immersion2.title,
    subtitle: "Notice how people get attention and make requests.",
    estimatedMinutes: 12,
    status: isMvp ? "published" : "seed",
    steps: [
      {
        id: `${language}-immersion-2-watch`,
        type: "immersion",
        title: "Ordering without translation",
        mediaTitle: immersion2.mediaTitle,
        mediaType: "short",
        instruction: "Search and watch a restaurant or café scene. Focus on the interaction — how does the customer signal the server? What polite words do you hear?",
        watchUrl: immersion2.watchUrl,
        focus: immersion2.focus
      },
      {
        id: `${language}-immersion-2-quiz`,
        type: "quiz",
        title: "What's happening?",
        prompt: "What is the main interaction in this scene?",
        options: [immersion2.quizAnswer, "Two people are arguing loudly", "Someone is giving a presentation"],
        answer: immersion2.quizAnswer,
        explanation: "Restaurant scenes are great for spotting social scripts — greetings, ordering, thanking, and paying."
      }
    ]
  });

  // ── Immersion 3 (park/playground) — all languages ──
  lessons.push({
    id: `${language}-immersion-3`,
    language,
    stageSlug: "immersion",
    title: immersion3.title,
    subtitle: "Relaxed outdoor conversation — watch body language for clues.",
    estimatedMinutes: 12,
    status: isMvp ? "published" : "seed",
    steps: [
      {
        id: `${language}-immersion-3-watch`,
        type: "immersion",
        title: "Park people-watching",
        mediaTitle: immersion3.mediaTitle,
        mediaType: "short",
        instruction: "Find a park or playground scene. Pay attention to who speaks to whom — children to parents, friends to each other. Tone matters more than words.",
        watchUrl: immersion3.watchUrl,
        focus: immersion3.focus
      },
      {
        id: `${language}-immersion-3-quiz`,
        type: "quiz",
        title: "Who is talking?",
        prompt: "Who are the people in this scene and what is the general mood?",
        options: [immersion3.quizAnswer, "A formal business meeting", "Someone giving a lecture"],
        answer: immersion3.quizAnswer,
        explanation: "Park scenes show everyday, spontaneous speech — much looser than scripted dialogues."
      }
    ]
  });

  // ── Immersion 4 (birthday/celebration) — all languages ──
  lessons.push({
    id: `${language}-immersion-4`,
    language,
    stageSlug: "immersion",
    title: immersion4.title,
    subtitle: "Celebrations are full of formulaic phrases — easy to catch.",
    estimatedMinutes: 12,
    status: isMvp ? "published" : "seed",
    steps: [
      {
        id: `${language}-immersion-4-watch`,
        type: "immersion",
        title: "Celebration spotting",
        mediaTitle: immersion4.mediaTitle,
        mediaType: "short",
        instruction: "Search for a birthday party or celebration scene. Watch for the key moments: arrival, gift-giving, singing, toasts. What phrases do people repeat?",
        watchUrl: immersion4.watchUrl,
        focus: immersion4.focus
      },
      {
        id: `${language}-immersion-4-quiz`,
        type: "quiz",
        title: "Party context",
        prompt: "What kind of event is taking place?",
        options: [immersion4.quizAnswer, "A funeral", "A sports match"],
        answer: immersion4.quizAnswer,
        explanation: "Celebrations have very predictable language — one of the easiest contexts to start picking out words."
      }
    ]
  });

  // ── Vocabulary 2 — Food & Drink — all languages ──
  lessons.push({
    id: `${language}-vocabulary-2`,
    language,
    stageSlug: "core-vocabulary",
    title: `Food & drink`,
    subtitle: "Names of everyday things you see in a kitchen.",
    estimatedMinutes: 10,
    status: isMvp ? "published" : "seed",
    steps: [
      {
        id: `${language}-vocab-2-cards`,
        type: "vocabulary",
        title: "Common foods and drinks",
        cards: vocab2
      },
      {
        id: `${language}-vocab-2-quiz`,
        type: "quiz",
        title: "Identify the food",
        prompt: `Which word is a round red fruit?`,
        options: vocab2.map((card) => card.term),
        answer: vocab2.find((c) => c.concept === "fruit")?.term ?? vocab2[2]?.term ?? "",
        explanation: "Connecting words to real objects makes them stick faster than memorizing lists."
      }
    ]
  });

  // ── Vocabulary 3 — Family & People — all languages ──
  lessons.push({
    id: `${language}-vocabulary-3`,
    language,
    stageSlug: "core-vocabulary",
    title: `Family & people`,
    subtitle: "The people you talk about every day.",
    estimatedMinutes: 10,
    status: isMvp ? "published" : "seed",
    steps: [
      {
        id: `${language}-vocab-3-cards`,
        type: "vocabulary",
        title: "Family members and friends",
        cards: vocab3
      },
      {
        id: `${language}-vocab-3-quiz`,
        type: "quiz",
        title: "Who's who?",
        prompt: `Which word means the male parent in a family?`,
        options: vocab3.map((card) => card.term),
        answer: vocab3.find((c) => c.translation === "father" || c.translation === "male parent")?.term ?? vocab3[1]?.term ?? "",
        explanation: "Family words are high-frequency — you'll hear them in almost every conversation."
      }
    ]
  });

  // ── Vocabulary 4 — Colors & Numbers — all languages ──
  lessons.push({
    id: `${language}-vocabulary-4`,
    language,
    stageSlug: "core-vocabulary",
    title: `Colors & numbers`,
    subtitle: "Describe the world around you.",
    estimatedMinutes: 10,
    status: isMvp ? "published" : "seed",
    steps: [
      {
        id: `${language}-vocab-4-cards`,
        type: "vocabulary",
        title: "Colors and first numbers",
        cards: vocab4
      },
      {
        id: `${language}-vocab-4-quiz`,
        type: "quiz",
        title: "Color identification",
        prompt: `Which word describes the color of the sky on a clear day?`,
        options: vocab4.map((card) => card.term),
        answer: vocab4.find((c) => c.translation.includes("blue") || c.translation.includes("sky"))?.term ?? vocab4[1]?.term ?? "",
        explanation: "Colors and numbers are building blocks for describing anything."
      }
    ]
  });

  // ── Story 2 — Dog & ball — all languages ──
  lessons.push({
    id: `${language}-story-2`,
    language,
    stageSlug: "sentence-production",
    title: story2.title,
    subtitle: "A playful story about a pet and a toy.",
    estimatedMinutes: 8,
    status: isMvp ? "published" : "seed",
    steps: [
      {
        id: `${language}-story-2-read`,
        type: "story",
        title: story2.title,
        text: story2.text,
        glossary: story2.glossary
      },
      {
        id: `${language}-story-2-quiz`,
        type: "quiz",
        title: "What color?",
        prompt: "What color is the object in the story?",
        options: ["Red", "Blue", "Green", "Yellow"],
        answer: "Red",
        explanation: "The story says 'red ball' — a simple detail to spot when reading for meaning."
      }
    ]
  });

  // ── Story 3 — Morning routine — all languages ──
  lessons.push({
    id: `${language}-story-3`,
    language,
    stageSlug: "sentence-production",
    title: story3.title,
    subtitle: "A gentle story about how a day begins.",
    estimatedMinutes: 8,
    status: isMvp ? "published" : "seed",
    steps: [
      {
        id: `${language}-story-3-read`,
        type: "story",
        title: story3.title,
        text: story3.text,
        glossary: story3.glossary
      },
      {
        id: `${language}-story-3-quiz`,
        type: "quiz",
        title: "Morning actions",
        prompt: "What happens at the very start of the story?",
        options: ["The sun rises", "Everyone goes to sleep", "It starts to rain", "A dog barks"],
        answer: "The sun rises",
        explanation: "The first line of the story sets the scene. Paying attention to opening sentences builds reading comprehension."
      }
    ]
  });

  // ── Story 4 — Rain/weather — all languages ──
  lessons.push({
    id: `${language}-story-4`,
    language,
    stageSlug: "sentence-production",
    title: story4.title,
    subtitle: "A calm story about a rainy day inside.",
    estimatedMinutes: 8,
    status: isMvp ? "published" : "seed",
    steps: [
      {
        id: `${language}-story-4-read`,
        type: "story",
        title: story4.title,
        text: story4.text,
        glossary: story4.glossary
      },
      {
        id: `${language}-story-4-quiz`,
        type: "quiz",
        title: "Weather check",
        prompt: "What is the weather like in this story?",
        options: ["Sunny and hot", "Rainy", "Snowy", "Windy"],
        answer: "Rainy",
        explanation: "The weather sets the mood. Noticing context details like weather helps anchor vocabulary."
      }
    ]
  });

  return lessons;
});

// ── Literacy / Sounds lessons (all 5 languages) ──

const literacyLessons: Lesson[] = languageCodes.flatMap((language): Lesson[] => {
  if (language === "ru") {
    return [
      {
        id: "ru-literacy-1",
        language: "ru",
        stageSlug: "literacy-sounds",
        title: literacyRussian.literacy1.title,
        subtitle: literacyRussian.literacy1.subtitle,
        estimatedMinutes: 10,
        status: "seed",
        steps: literacyRussian.literacy1.steps
      },
      {
        id: "ru-literacy-2",
        language: "ru",
        stageSlug: "literacy-sounds",
        title: literacyRussian.literacy2.title,
        subtitle: literacyRussian.literacy2.subtitle,
        estimatedMinutes: 10,
        status: "seed",
        steps: literacyRussian.literacy2.steps
      }
    ];
  }

  const latinLit = literacyLatinByLanguage[language];
  if (!latinLit) return [];

  return [
    {
      id: `${language}-literacy-1`,
      language,
      stageSlug: "literacy-sounds",
      title: latinLit.literacy1.title,
      subtitle: latinLit.literacy1.subtitle,
      estimatedMinutes: 10,
      status: languages[language].launchTier === "mvp" ? "published" : "seed",
      steps: latinLit.literacy1.steps
    },
    {
      id: `${language}-literacy-2`,
      language,
      stageSlug: "literacy-sounds",
      title: latinLit.literacy2.title,
      subtitle: latinLit.literacy2.subtitle,
      estimatedMinutes: 10,
      status: languages[language].launchTier === "mvp" ? "published" : "seed",
      steps: latinLit.literacy2.steps
    }
  ];
});

// Combine all seed lessons
export const allSeedLessons: Lesson[] = [...seedLessons, ...literacyLessons];

export const seedRecommendations: MediaRecommendation[] = [
  { id: "es-coco", language: "es", title: "Coco", mediaType: "movie", stageSlug: "immersion", reason: "Strong visual storytelling and culturally relevant Spanish-language music/context.", challenge: "Watch one musical scene in Spanish with no subtitles, then describe the mood in one sentence.", affiliateUrl: "https://www.disneyplus.com/movies/coco", stageHintId: 1 },
  { id: "fr-amelie", language: "fr", title: "Amélie", mediaType: "movie", stageSlug: "immersion", reason: "Iconic French cultural reference with expressive visual scenes.", challenge: "Watch a short café or street scene with no subtitles and identify the social situation.", affiliateUrl: "https://www.amazon.com/Amelie-Audrey-Tautou/dp/B0000AQS0F" },
  { id: "en-paddington", language: "en", title: "Paddington", mediaType: "movie", stageSlug: "immersion", reason: "Clear family-friendly context, expressive scenes, and accessible everyday English.", challenge: "Watch a scene and list three actions you understood visually.", affiliateUrl: "https://www.amazon.com/Paddington-Hugh-Bonneville/dp/B00N3RFMH6" },
  { id: "de-goodbye-lenin", language: "de", title: "Good Bye, Lenin!", mediaType: "movie", stageSlug: "immersion", reason: "Socially relevant German film with strong cultural context.", challenge: "Watch a short scene and focus only on greetings and emotional tone.", affiliateUrl: "https://www.amazon.com/Good-Bye-Lenin-Daniel-Bruhl/dp/B0000AQS0G" },
  { id: "ru-cheburashka", language: "ru", title: "Cheburashka", mediaType: "movie", stageSlug: "immersion", reason: "Culturally familiar Russian media with visual humor and simple emotional cues.", challenge: "Watch a short clip and notice repeated sounds, names, and Cyrillic shapes." },
  // ── Expanded Spanish recommendations ──
  { id: "es-romancero", language: "es", title: "El Romancero Gitano", mediaType: "book", stageSlug: "immersion", reason: "Poetry with strong rhythm and repeated refrains — great for musical ear training in Spanish.", challenge: "Read one poem aloud and notice repeated vowel patterns.", affiliateUrl: "https://www.amazon.com/Romancero-gitano-Federico-Garcia-Lorca/dp/8420674127" },
  { id: "es-nadie-es-perfecto", language: "es", title: "Nadie es perfecto (Podcast)", mediaType: "podcast", stageSlug: "immersion", reason: "Clear conversational Spanish with both native and learner speakers — natural dialogue cadence.", challenge: "Listen to the first 5 minutes and write down 3 words you heard more than once." },
  { id: "es-luis-fonsi", language: "es", title: "Despacito — Luis Fonsi", mediaType: "music", stageSlug: "immersion", reason: "Ubiquitous pop song with clear, repetitive lyrics and a slow chorus.", challenge: "Listen without subtitles and identify the chorus phrase that repeats most.", affiliateUrl: "https://www.youtube.com/playlist?list=PLSzYqkXKjK4Jr1Kj6d8fXq7Ql7Z7Z7Z7Z" },
  { id: "es-el-laberinto", language: "es", title: "El Laberinto del Fauno", mediaType: "movie", stageSlug: "immersion", reason: "Spanish-language fantasy with strong visual narrative, making it easier to infer meaning.", challenge: "Watch a 5-minute scene and identify the emotional tone of each character exchange." },
  // ── Expanded French recommendations ──
  { id: "fr-intouchables", language: "fr", title: "Les Intouchables", mediaType: "movie", stageSlug: "immersion", reason: "Modern French classic with natural dialogue, humor, and strong non-verbal cues.", challenge: "Watch the opening 10 minutes and describe the relationship dynamic between the two characters.", affiliateUrl: "https://www.amazon.com/Intouchables-Omar-Sy/dp/B007VBJEGU" },
  { id: "fr-inner-french", language: "fr", title: "InnerFrench (Podcast)", mediaType: "podcast", stageSlug: "immersion", reason: "Deliberately slow, clear French with cultural topics — perfect for building listening stamina.", challenge: "Listen to one episode without pausing and note every moment you understood a full sentence." },
  { id: "fr-kaamelott", language: "fr", title: "Kaamelott — Livre I", mediaType: "series", stageSlug: "immersion", reason: "Cult French comedy series with short episodes, exaggerated acting, and repetitive situational humor.", challenge: "Watch one short episode and identify the running joke from visual cues alone." },
  { id: "fr-stromae", language: "fr", title: "Stromae — Tous les mêmes", mediaType: "music", stageSlug: "immersion", reason: "Electro-pop with clear French lyrics and a music video that reinforces meaning through visuals.", challenge: "Watch the music video and write down three emotion words the song conveys." },
  // ── Expanded English recommendations ──
  { id: "en-bbc-6min", language: "en", title: "BBC 6 Minute English", mediaType: "podcast", stageSlug: "immersion", reason: "Short, scripted conversations on accessible topics with vocabulary breakdowns built in.", challenge: "Listen to one episode and repeat each key phrase out loud after hearing it." },
  { id: "en-disney-basics", language: "en", title: "Disney Nature — Penguins", mediaType: "movie", stageSlug: "immersion", reason: "Narrated nature documentary with slow, clear English narration and predictable sentence patterns.", challenge: "Watch 5 minutes and count how many times the narrator uses a present-tense verb.", affiliateUrl: "https://www.disneyplus.com/movies/disney-nature-penguins" },
  { id: "en-the-economist", language: "en", title: "The Economist Espresso", mediaType: "book", stageSlug: "immersion", reason: "Concise daily briefing with rich vocabulary in short, digestible paragraphs.", challenge: "Read one briefing and underline every adjective you understand in context." },
  { id: "en-queen", language: "en", title: "Queen — Bohemian Rhapsody", mediaType: "music", stageSlug: "immersion", reason: "Iconic song with varied vocal delivery, clear English phrases, and a story-driven structure.", challenge: "Listen and write down the first sentence that paints a vivid mental picture." },
  // ── Expanded German recommendations ──
  { id: "de-nicos-weg", language: "de", title: "Nicos Weg — Deutsche Welle", mediaType: "series", stageSlug: "immersion", reason: "Free, graded video series designed for German learners — scaffolded from A1.", challenge: "Watch the A1 episode and list every time you hear 'und' or 'ja'.", affiliateUrl: "https://learngerman.dw.com/en/course/nicos-weg/" },
  { id: "de-slow-german", language: "de", title: "Slow German (Podcast)", mediaType: "podcast", stageSlug: "immersion", reason: "Deliberately paced German podcast with transcripts and cultural topics.", challenge: "Listen to one episode at normal speed first, then read the transcript after." },
  { id: "de-rammstein", language: "de", title: "Rammstein — Sonne", mediaType: "music", stageSlug: "immersion", reason: "Slow, heavy articulation makes each word distinct — surprisingly accessible for listening practice.", challenge: "Listen to the chorus and write down every word you can identify." },
  { id: "de-lola-rennt", language: "de", title: "Lola rennt (Run Lola Run)", mediaType: "movie", stageSlug: "immersion", reason: "Fast-paced but highly visual German film with repeated scenes — great for pattern recognition.", challenge: "Watch the first sequence and identify the sound that signals something important." },
  // ── Expanded Russian recommendations ──
  { id: "ru-russian-podcast", language: "ru", title: "Russian Podcast for Beginners", mediaType: "podcast", stageSlug: "immersion", reason: "Slow, simplified Russian with clear topic framing and repetition.", challenge: "Listen to the first 3 minutes and write down all the words you recognize from visual context alone." },
  { id: "ru-nu-pogodi", language: "ru", title: "Nu, Pogodi! (Ну, погоди!)", mediaType: "series", stageSlug: "immersion", reason: "Beloved Russian cartoon with minimal dialogue and exaggerated physical comedy.", challenge: "Watch one episode without subtitles and describe what happened using just gestures." },
  { id: "ru-kalinka", language: "ru", title: "Kalinka — Ivan Larionov", mediaType: "music", stageSlug: "immersion", reason: "Classic Russian folk song with a repetitive chorus that drills core vowel sounds.", challenge: "Try to sing the chorus and count how many times the title word appears." },
  { id: "ru-moskva-slezam", language: "ru", title: "Москва слезам не верит", mediaType: "movie", stageSlug: "immersion", reason: "Iconic Soviet film with clear emotional cues and strong visual storytelling.", challenge: "Watch a 5-minute scene and describe the characters' relationships from body language." }
];

export function lessonsForLanguage(language: LanguageCode) {
  return allSeedLessons.filter((lesson) => lesson.language === language);
}

export function recommendationsForLanguage(language: LanguageCode) {
  return seedRecommendations.filter((recommendation) => recommendation.language === language);
}

export function getLessonById(id: string) {
  return allSeedLessons.find((lesson) => lesson.id === id);
}

export function getRecommendationById(id: string) {
  return seedRecommendations.find((rec) => rec.id === id);
}

export type ImmersionSession = {
  recommendationId: string;
  notes: string;
  reflections: string[];
  language: LanguageCode;
};

export * from "./auth";
export * from "./api-client";
