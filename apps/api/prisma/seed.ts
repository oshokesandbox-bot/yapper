import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const LANGUAGES = [
  { code: "EN" as const, englishName: "English", nativeName: "English", launchTier: "MVP" as const, script: "latin" },
  { code: "FR" as const, englishName: "French", nativeName: "Français", launchTier: "MVP" as const, script: "latin" },
  { code: "ES" as const, englishName: "Spanish", nativeName: "Español", launchTier: "MVP" as const, script: "latin" },
  { code: "DE" as const, englishName: "German", nativeName: "Deutsch", launchTier: "SEED" as const, script: "latin" },
  { code: "RU" as const, englishName: "Russian", nativeName: "Русский", launchTier: "SEED" as const, script: "cyrillic" }
];

const STAGES = [
  { id: 1, slug: "immersion", label: "Immersion", userStep: 1, purpose: "Build unconscious familiarity through context-rich audio/video input.", isMvp: true },
  { id: 2, slug: "literacy-sounds", label: "Literacy & Sounds", userStep: 2, purpose: "Map sounds to symbols, scripts, pronunciation, and basic decoding.", isMvp: true },
  { id: 3, slug: "core-vocabulary", label: "Core Vocabulary", userStep: 2, purpose: "Acquire high-frequency words and lexical chunks in context.", isMvp: true },
  { id: 4, slug: "sentence-production", label: "Simple Sentence Production", userStep: 3, purpose: "Read, write, and speak simple sentences about familiar scenes.", isMvp: false },
  { id: 5, slug: "dictionary-reference", label: "Dictionary & Reference Skills", userStep: 4, purpose: "Use dictionaries, collocations, register, and references independently.", isMvp: false },
  { id: 6, slug: "grammar-figures", label: "Grammar & Figures of Speech", userStep: 4, purpose: "Discover higher-order grammar, parts of speech, idioms, and figurative language.", isMvp: false },
  { id: 7, slug: "comprehension-tests", label: "Comprehension Tests", userStep: 5, purpose: "Measure reading, listening, and viewing comprehension across registers.", isMvp: false },
  { id: 8, slug: "composition-tests", label: "Lexis, Structure & Composition", userStep: 5, purpose: "Assess vocabulary range, syntax, structure, and composition quality.", isMvp: false }
];

type LangCode = "EN" | "FR" | "ES" | "DE" | "RU";

interface VocabCard {
  term: string;
  translation: string;
  concept: string;
  pronunciationHint: string;
}

const sharedVocabulary: Record<LangCode, VocabCard[]> = {
  ES: [
    { term: "hola", translation: "hello", concept: "greeting", pronunciationHint: "OH-lah" },
    { term: "agua", translation: "water", concept: "drink", pronunciationHint: "AH-gwah" },
    { term: "casa", translation: "house", concept: "place", pronunciationHint: "KAH-sah" },
    { term: "gato", translation: "cat", concept: "animal", pronunciationHint: "GAH-toh" },
    { term: "sol", translation: "sun", concept: "nature", pronunciationHint: "sohl" },
    { term: "pan", translation: "bread", concept: "food", pronunciationHint: "pahn" },
    { term: "mesa", translation: "table", concept: "furniture", pronunciationHint: "MEH-sah" },
    { term: "niño", translation: "boy/child", concept: "person", pronunciationHint: "NYEE-nyoh" }
  ],
  FR: [
    { term: "bonjour", translation: "hello", concept: "greeting", pronunciationHint: "bohn-ZHOOR" },
    { term: "eau", translation: "water", concept: "drink", pronunciationHint: "oh" },
    { term: "maison", translation: "house", concept: "place", pronunciationHint: "meh-ZON" },
    { term: "chat", translation: "cat", concept: "animal", pronunciationHint: "shah" },
    { term: "soleil", translation: "sun", concept: "nature", pronunciationHint: "soh-LAY" },
    { term: "pain", translation: "bread", concept: "food", pronunciationHint: "pan" },
    { term: "table", translation: "table", concept: "furniture", pronunciationHint: "TAH-bluh" },
    { term: "enfant", translation: "child", concept: "person", pronunciationHint: "ahn-FAHN" }
  ],
  EN: [
    { term: "hello", translation: "greeting", concept: "greeting", pronunciationHint: "heh-LOH" },
    { term: "water", translation: "drink", concept: "drink", pronunciationHint: "WAH-ter" },
    { term: "house", translation: "place", concept: "place", pronunciationHint: "hows" },
    { term: "cat", translation: "animal", concept: "animal", pronunciationHint: "kat" },
    { term: "sun", translation: "sun", concept: "nature", pronunciationHint: "suhn" },
    { term: "bread", translation: "bread", concept: "food", pronunciationHint: "bred" },
    { term: "table", translation: "table", concept: "furniture", pronunciationHint: "TAY-bull" },
    { term: "child", translation: "child", concept: "person", pronunciationHint: "chyld" }
  ],
  DE: [
    { term: "hallo", translation: "hello", concept: "greeting", pronunciationHint: "HAH-loh" },
    { term: "Wasser", translation: "water", concept: "drink", pronunciationHint: "VAH-ser" },
    { term: "Haus", translation: "house", concept: "place", pronunciationHint: "hows" },
    { term: "Katze", translation: "cat", concept: "animal", pronunciationHint: "KAT-suh" },
    { term: "Sonne", translation: "sun", concept: "nature", pronunciationHint: "ZON-neh" },
    { term: "Brot", translation: "bread", concept: "food", pronunciationHint: "broht" },
    { term: "Tisch", translation: "table", concept: "furniture", pronunciationHint: "tish" },
    { term: "Kind", translation: "child", concept: "person", pronunciationHint: "kint" }
  ],
  RU: [
    { term: "привет", translation: "hello", concept: "greeting", pronunciationHint: "pree-VYET" },
    { term: "вода", translation: "water", concept: "drink", pronunciationHint: "vah-DAH" },
    { term: "дом", translation: "house", concept: "place", pronunciationHint: "dohm" },
    { term: "кот", translation: "cat", concept: "animal", pronunciationHint: "koht" },
    { term: "солнце", translation: "sun", concept: "nature", pronunciationHint: "SON-tseh" },
    { term: "хлеб", translation: "bread", concept: "food", pronunciationHint: "khlyeb" },
    { term: "стол", translation: "table", concept: "furniture", pronunciationHint: "stohl" },
    { term: "ребёнок", translation: "child", concept: "person", pronunciationHint: "reh-BYOH-nok" }
  ]
};

interface StoryData {
  title: string;
  text: string;
  glossary: { term: string; translation: string }[];
}

const stories: Record<LangCode, StoryData> = {
  ES: {
    title: "El gato y el sol",
    text: "El gato mira el sol. La casa está tranquila. El gato bebe agua y dice hola.",
    glossary: [{ term: "mira", translation: "looks" }, { term: "tranquila", translation: "quiet" }]
  },
  FR: {
    title: "Le chat et le soleil",
    text: "Le chat regarde le soleil. La maison est calme. Le chat boit de l'eau et dit bonjour.",
    glossary: [{ term: "regarde", translation: "looks" }, { term: "calme", translation: "calm" }]
  },
  EN: {
    title: "The cat and the sun",
    text: "The cat looks at the sun. The house is quiet. The cat drinks water and says hello.",
    glossary: [{ term: "looks", translation: "directs eyes" }, { term: "quiet", translation: "not noisy" }]
  },
  DE: {
    title: "Die Katze und die Sonne",
    text: "Die Katze sieht die Sonne. Das Haus ist ruhig. Die Katze trinkt Wasser und sagt hallo.",
    glossary: [{ term: "sieht", translation: "sees" }, { term: "ruhig", translation: "quiet" }]
  },
  RU: {
    title: "Кот и солнце",
    text: "Кот смотрит на солнце. Дом тихий. Кот пьёт воду и говорит привет.",
    glossary: [{ term: "смотрит", translation: "looks" }, { term: "тихий", translation: "quiet" }]
  }
};

interface ImmersionData {
  mediaTitle: string;
  watchUrl: string;
  focus: string[];
  quizAnswer: string;
}

const immersions: Record<LangCode, { title: string } & ImmersionData> = {
  ES: {
    title: "Spanish café immersion",
    mediaTitle: "A busy café scene",
    watchUrl: "https://www.youtube.com/results?search_query=spanish+cafe+scene+beginner",
    focus: ["Listen for greetings", "Watch gestures before guessing meaning", "Notice repeated words around ordering"],
    quizAnswer: "Someone orders a drink"
  },
  FR: {
    title: "French market immersion",
    mediaTitle: "A morning market exchange",
    watchUrl: "https://www.youtube.com/results?search_query=french+market+scene+beginner",
    focus: ["Listen for bonjour", "Notice pointing and object names", "Focus on rhythm, not translation"],
    quizAnswer: "People greet and buy food"
  },
  EN: {
    title: "English family scene immersion",
    mediaTitle: "A simple family breakfast",
    watchUrl: "https://www.youtube.com/results?search_query=english+family+breakfast+scene+beginner",
    focus: ["Listen for everyday nouns", "Watch actions before words", "Notice question intonation"],
    quizAnswer: "A family talks at breakfast"
  },
  DE: {
    title: "German train station immersion",
    mediaTitle: "A short station interaction",
    watchUrl: "https://www.youtube.com/results?search_query=german+train+station+dialogue+beginner",
    focus: ["Listen for hallo and danke", "Notice compound nouns on signs", "Do not pause for grammar yet"],
    quizAnswer: "Someone asks about travel"
  },
  RU: {
    title: "Russian shop immersion",
    mediaTitle: "A simple shop interaction",
    watchUrl: "https://www.youtube.com/results?search_query=russian+shop+dialogue+beginner",
    focus: ["Listen for привет", "Watch the object exchange", "Notice Cyrillic shapes in signs"],
    quizAnswer: "Someone buys something"
  }
};

async function main() {
  console.log("🌱 Seeding Yapper database…");

  // 1. Seed languages
  for (const lang of LANGUAGES) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: { isActive: true },
      create: lang
    });
  }
  console.log("✅ Languages seeded");

  // 2. Seed stages
  for (const stage of STAGES) {
    await prisma.stage.upsert({
      where: { id: stage.id },
      update: { slug: stage.slug, label: stage.label, purpose: stage.purpose, isMvp: stage.isMvp },
      create: stage
    });
  }
  console.log("✅ Stages seeded");

  // 3. Seed vocabulary items
  for (const [code, cards] of Object.entries(sharedVocabulary)) {
    for (const card of cards) {
      await prisma.vocabularyItem.upsert({
        where: { id: `${code.toLowerCase()}-vocab-${card.term}` },
        update: { term: card.term, translation: card.translation, concept: card.concept, pronunciationHint: card.pronunciationHint },
        create: {
          id: `${code.toLowerCase()}-vocab-${card.term}`,
          language: code as LangCode,
          term: card.term,
          translation: card.translation,
          concept: card.concept,
          pronunciationHint: card.pronunciationHint,
          stageSlug: "core-vocabulary"
        }
      });
    }
  }
  console.log("✅ Vocabulary seeded");

  // 4. Seed lessons
  for (const [code, langRecord] of Object.entries({ ES: {}, FR: {}, EN: {}, DE: {}, RU: {} })) {
    const langCode = code as LangCode;
    const isMvp = LANGUAGES.find(l => l.code === langCode)!.launchTier === "MVP";
    const status = isMvp ? "PUBLISHED" as const : "DRAFT" as const;

    // Immersion lesson
    const immersion = immersions[langCode];
    await prisma.lesson.upsert({
      where: { id: `${langCode.toLowerCase()}-immersion-1` },
      update: {
        title: immersion.title,
        subtitle: "Watch first. Translate later. Let your ear collect patterns.",
        status,
        estimatedMinutes: 12
      },
      create: {
        id: `${langCode.toLowerCase()}-immersion-1`,
        language: langCode,
        stageId: 1,
        title: immersion.title,
        subtitle: "Watch first. Translate later. Let your ear collect patterns.",
        status,
        estimatedMinutes: 12
      }
    });

    await prisma.lessonStep.upsert({
      where: { lessonId_order: { lessonId: `${langCode.toLowerCase()}-immersion-1`, order: 0 } },
      update: { payload: { mediaTitle: immersion.mediaTitle, instruction: "Open the suggested search, pick a short scene, and watch without subtitles.", watchUrl: immersion.watchUrl, focus: immersion.focus } },
      create: {
        id: `${langCode.toLowerCase()}-immersion-step-1`,
        lessonId: `${langCode.toLowerCase()}-immersion-1`,
        order: 0,
        kind: "MOVIE_RECOMMENDATION",
        payload: { mediaTitle: immersion.mediaTitle, instruction: "Open the suggested search, pick a short scene, and watch without subtitles.", watchUrl: immersion.watchUrl, focus: immersion.focus }
      }
    });

    await prisma.lessonStep.upsert({
      where: { lessonId_order: { lessonId: `${langCode.toLowerCase()}-immersion-1`, order: 1 } },
      update: { payload: { prompt: "Based on the scene, what was most likely happening?", options: [immersion.quizAnswer, "Someone gives a formal speech", "Two people silently read a book"], answer: immersion.quizAnswer, explanation: "The goal is contextual understanding, not word-for-word translation." } },
      create: {
        id: `${langCode.toLowerCase()}-immersion-step-2`,
        lessonId: `${langCode.toLowerCase()}-immersion-1`,
        order: 1,
        kind: "COMPREHENSION_QUESTION",
        payload: { prompt: "Based on the scene, what was most likely happening?", options: [immersion.quizAnswer, "Someone gives a formal speech", "Two people silently read a book"], answer: immersion.quizAnswer, explanation: "The goal is contextual understanding, not word-for-word translation." }
      }
    });

    // Vocabulary lesson
    const vocab = sharedVocabulary[langCode];
    await prisma.lesson.upsert({
      where: { id: `${langCode.toLowerCase()}-vocabulary-1` },
      update: {
        title: `${LANGUAGES.find(l => l.code === langCode)!.englishName} first concepts`,
        subtitle: "Connect words to ideas before memorizing grammar.",
        status,
        estimatedMinutes: 10
      },
      create: {
        id: `${langCode.toLowerCase()}-vocabulary-1`,
        language: langCode,
        stageId: 3,
        title: `${LANGUAGES.find(l => l.code === langCode)!.englishName} first concepts`,
        subtitle: "Connect words to ideas before memorizing grammar.",
        status,
        estimatedMinutes: 10
      }
    });

    await prisma.lessonStep.upsert({
      where: { lessonId_order: { lessonId: `${langCode.toLowerCase()}-vocabulary-1`, order: 0 } },
      update: { payload: { title: "Eight anchor words", cards: vocab } as unknown as Prisma.InputJsonValue },
      create: {
        id: `${langCode.toLowerCase()}-vocab-step-1`,
        lessonId: `${langCode.toLowerCase()}-vocabulary-1`,
        order: 0,
        kind: "VOCABULARY_CARD",
        payload: { title: "Eight anchor words", cards: vocab } as unknown as Prisma.InputJsonValue
      }
    });

    await prisma.lessonStep.upsert({
      where: { lessonId_order: { lessonId: `${langCode.toLowerCase()}-vocabulary-1`, order: 1 } },
      update: { payload: { prompt: `Which word is connected to "${vocab[1]!.concept}"?`, options: vocab.map(c => c.term), answer: vocab[1]!.term, explanation: "Yapper teaches vocabulary by concept first." } },
      create: {
        id: `${langCode.toLowerCase()}-vocab-step-2`,
        lessonId: `${langCode.toLowerCase()}-vocabulary-1`,
        order: 1,
        kind: "COMPREHENSION_QUESTION",
        payload: { prompt: `Which word is connected to "${vocab[1]!.concept}"?`, options: vocab.map(c => c.term), answer: vocab[1]!.term, explanation: "Yapper teaches vocabulary by concept first." }
      }
    });

    // Story lesson
    const story = stories[langCode];
    await prisma.lesson.upsert({
      where: { id: `${langCode.toLowerCase()}-story-1` },
      update: {
        title: story.title,
        subtitle: "A tiny children's-book style reader for simple sentence rhythm.",
        status,
        estimatedMinutes: 8
      },
      create: {
        id: `${langCode.toLowerCase()}-story-1`,
        language: langCode,
        stageId: 4,
        title: story.title,
        subtitle: "A tiny children's-book style reader for simple sentence rhythm.",
        status,
        estimatedMinutes: 8
      }
    });

    await prisma.lessonStep.upsert({
      where: { lessonId_order: { lessonId: `${langCode.toLowerCase()}-story-1`, order: 0 } },
      update: { payload: { title: story.title, text: story.text, glossary: story.glossary } },
      create: {
        id: `${langCode.toLowerCase()}-story-step-1`,
        lessonId: `${langCode.toLowerCase()}-story-1`,
        order: 0,
        kind: "MICRO_STORY",
        payload: { title: story.title, text: story.text, glossary: story.glossary }
      }
    });

    await prisma.lessonStep.upsert({
      where: { lessonId_order: { lessonId: `${langCode.toLowerCase()}-story-1`, order: 1 } },
      update: { payload: { prompt: "Which object appears in the story?", options: [vocab[3]!.translation, "airplane", "mountain"], answer: vocab[3]!.translation, explanation: "Simple stories let you read for meaning without drowning in text." } },
      create: {
        id: `${langCode.toLowerCase()}-story-step-2`,
        lessonId: `${langCode.toLowerCase()}-story-1`,
        order: 1,
        kind: "COMPREHENSION_QUESTION",
        payload: { prompt: "Which object appears in the story?", options: [vocab[3]!.translation, "airplane", "mountain"], answer: vocab[3]!.translation, explanation: "Simple stories let you read for meaning without drowning in text." }
      }
    });
  }
  console.log("✅ Lessons and steps seeded");

  // 5. Seed media recommendations
  const recommendations = [
    { id: "es-coco", language: "ES" as const, title: "Coco", mediaType: "movie", stageHintId: 1, reason: "Strong visual storytelling and culturally relevant Spanish-language music/context.", challenge: "Watch one musical scene in Spanish with no subtitles, then describe the mood in one sentence." },
    { id: "fr-amelie", language: "FR" as const, title: "Amélie", mediaType: "movie", stageHintId: 1, reason: "Iconic French cultural reference with expressive visual scenes.", challenge: "Watch a short café or street scene with no subtitles and identify the social situation." },
    { id: "en-paddington", language: "EN" as const, title: "Paddington", mediaType: "movie", stageHintId: 1, reason: "Clear family-friendly context, expressive scenes, and accessible everyday English.", challenge: "Watch a scene and list three actions you understood visually." },
    { id: "de-goodbye-lenin", language: "DE" as const, title: "Good Bye, Lenin!", mediaType: "movie", stageHintId: 1, reason: "Socially relevant German film with strong cultural context.", challenge: "Watch a short scene and focus only on greetings and emotional tone." },
    { id: "ru-cheburashka", language: "RU" as const, title: "Cheburashka", mediaType: "movie", stageHintId: 1, reason: "Culturally familiar Russian media with visual humor and simple emotional cues.", challenge: "Watch a short clip and notice repeated sounds, names, and Cyrillic shapes." }
  ];

  for (const rec of recommendations) {
    await prisma.mediaRecommendation.upsert({
      where: { id: rec.id },
      update: { language: rec.language, title: rec.title, mediaType: rec.mediaType, reason: rec.reason, challenge: rec.challenge },
      create: rec
    });
  }
  console.log("✅ Media recommendations seeded");

  // 6. Add an admin user
  const adminEmail = "admin@yapper.app";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const bcrypt = await import("bcryptjs");
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await bcrypt.hash("admin123", 12),
        displayName: "Admin",
        isAdmin: true
      }
    });
    console.log("✅ Admin user created (admin@yapper.app / admin123)");
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
