"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, CardContent, Progress } from "@yapper/ui";
import { seedRecommendations } from "@yapper/shared";
import type { LanguageCode, MediaRecommendation } from "@yapper/shared";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://yapper-mc7e.onrender.com";

const mediaTypeIcons: Record<string, string> = {
  movie: "🎬",
  series: "📺",
  book: "📖",
  music: "🎵",
  podcast: "🎙️"
};

type Step = "prep" | "watch" | "reflect" | "summary";

const focusQuestions: Record<string, string[]> = {
  es: ["What greetings or politeness words did you hear?", "How did people signal each other's attention?", "What sounds or words repeated the most?"],
  fr: ["Did you recognise any greetings?", "What gestures helped you understand the scene?", "Which sounds or words seemed most frequent?"],
  en: ["What everyday nouns stood out to you?", "How did characters indicate their feelings?", "What phrases or sounds repeated most?"],
  de: ["Which politeness words did you catch?", "Did you notice formal vs informal address?", "What compound words could you recognise from context?"],
  ru: ["What words beginning with familiar Cyrillic letters did you spot?", "Did you recognise any greetings?", "How did tone help you guess meaning?"]
};

export function ImmerseClient() {
  const params = useParams();
  const id = typeof params.recommendationId === "string" ? params.recommendationId : "";

  const [rec, setRec] = useState<MediaRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("prep");
  const [notes, setNotes] = useState("");
  const [reflections, setReflections] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const language = rec?.language ?? "es";

  const questions = useMemo(() => {
    return focusQuestions[language] ?? focusQuestions.en;
  }, [language]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/api/recommendations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRec(data.recommendation);
        setLoading(false);
      })
      .catch(() => {
        const seed = seedRecommendations.find((r) => r.id === id);
        setRec(seed ?? null);
        setLoading(false);
      });
  }, [id]);

  const stepIndex = useMemo(() => {
    const order: Step[] = ["prep", "watch", "reflect", "summary"];
    return order.indexOf(step);
  }, [step]);

  const progress = useMemo(() => {
    return Math.round(((stepIndex + 1) / 4) * 100);
  }, [stepIndex]);

  const stepTitle = useMemo(() => {
    const titles: Record<Step, string> = {
      prep: "Prepare for immersion",
      watch: "Watch & observe",
      reflect: "Reflect on what you noticed",
      summary: "Session summary"
    };
    return titles[step];
  }, [step]);

  async function completeImmersion() {
    const token = typeof window !== "undefined" ? localStorage.getItem("yapper:token") : null;
    setSaving(true);

    try {
      await fetch(`${apiUrl}/api/immersion/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          recommendationId: id,
          notes,
          reflections: reflections.filter(Boolean),
          language
        })
      });
    } catch {
      // Save best-effort
    }

    setSaving(false);
    setSaved(true);
  }

  function handleReflectionChange(index: number, value: string) {
    const updated = [...reflections];
    updated[index] = value;
    setReflections(updated);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 pb-16">
        <p className="text-slate-400">Loading immersion&hellip;</p>
      </main>
    );
  }

  if (!rec) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <h1 className="text-2xl font-semibold mb-1">Media not found</h1>
          <p className="text-slate-400 mb-4">This recommendation doesn&apos;t exist.</p>
          <Link href="/recommendations" className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800">
            Browse recommendations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 pb-16">
      <nav className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-black tracking-tighter">Yapper</Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-500">Immerse</span>
        </div>
        <Link
          href={`/recommendations/${id}`}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          &larr; Back to recommendation
        </Link>
      </nav>

      <div className="grid gap-4">
        {/* Progress bar & step indicator */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 font-black uppercase tracking-widest text-xs">{stepTitle}</span>
              <span className="text-sm text-slate-400">Step {stepIndex + 1} of 4</span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between mt-2">
              {(["prep", "watch", "reflect", "summary"] as Step[]).map((s, i) => (
                <span
                  key={s}
                  className={`text-xs ${stepIndex >= i ? "text-blue-600 font-medium" : "text-slate-300"}`}
                >
                  {["Prep", "Watch", "Reflect", "Summary"][i]}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step content */}
        <Card>
          <CardContent className="grid gap-6 min-h-[300px]">
            {/* Title & media badges */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex gap-2 flex-wrap mb-2">
                  <Badge variant="default">{rec.language.toUpperCase()}</Badge>
                  <Badge variant="secondary">{mediaTypeIcons[rec.mediaType]} {rec.mediaType}</Badge>
                </div>
                <h1 className="text-2xl font-semibold">{rec.title}</h1>
              </div>
            </div>

            {/* ─── PREP STEP ─── */}
            {step === "prep" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Focus question</p>
                  <p className="text-blue-700">{questions[0]}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Before you start</h3>
                  <ul className="list-disc pl-5 grid gap-1.5 text-sm text-slate-600">
                    <li>Watch without subtitles</li>
                    <li>Listen for sounds and patterns</li>
                    <li>Notice gestures and context</li>
                    <li>Don&apos;t try to translate &mdash; just observe</li>
                  </ul>
                </div>
                {rec.challenge && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-800 mb-1">Your challenge</p>
                    <p className="text-amber-700 text-sm">{rec.challenge}</p>
                  </div>
                )}
                <Button onClick={() => setStep("watch")}>
                  Start watching
                </Button>
              </div>
            )}

            {/* ─── WATCH STEP ─── */}
            {step === "watch" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold mb-1">Challenge prompt</p>
                  <p className="text-sm text-slate-600">{rec.challenge ?? "Watch and observe. What do you notice?"}</p>
                </div>

                {/* YouTube embed placeholder or link-out */}
                <div className="rounded-2xl border border-slate-200 bg-slate-100 p-8 text-center">
                  <p className="text-4xl mb-2">🎬</p>
                  <p className="text-sm text-slate-500 mb-3">Find &ldquo;{rec.title}&rdquo; on your preferred streaming platform.</p>
                  {rec.affiliateUrl ? (
                    <a
                      href={rec.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800"
                    >
                      Open streaming link
                    </a>
                  ) : (
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(rec.title + " " + rec.language)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800"
                    >
                      Search for it
                    </a>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="text-sm font-medium mb-1 block">Your observation notes</label>
                  <textarea
                    id="notes"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[100px]"
                    placeholder="What did you notice during the watch? Any repeated sounds, gestures, or words that stood out?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button onClick={() => setStep("reflect")}>
                  I&apos;ve watched it
                </Button>
              </div>
            )}

            {/* ─── REFLECT STEP ─── */}
            {step === "reflect" && (
              <div className="grid gap-4">
                <p className="text-sm text-slate-500">There are no right or wrong answers. Just note what you noticed.</p>
                {questions.map((question, i) => (
                  <div key={i}>
                    <label htmlFor={`reflect-${i}`} className="text-sm font-medium mb-1 block">{question}</label>
                    <textarea
                      id={`reflect-${i}`}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[60px]"
                      placeholder="Type your observation..."
                      value={reflections[i] ?? ""}
                      onChange={(e) => handleReflectionChange(i, e.target.value)}
                    />
                  </div>
                ))}
                <Button onClick={() => { setStep("summary"); completeImmersion(); }}>
                  Done reflecting
                </Button>
              </div>
            )}

            {/* ─── SUMMARY STEP ─── */}
            {step === "summary" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                  <p className="text-4xl mb-2">{saved ? "✅" : "⏳"}</p>
                  <h2 className="text-xl font-semibold mb-1">
                    {saved ? "Immersion session logged!" : "Saving your session..."}
                  </h2>
                  <p className="text-sm text-green-700">
                    {saved
                      ? "Your immersion session has been recorded. Keep building that unconscious familiarity!"
                      : "Please wait while we save your progress..."}
                  </p>
                </div>

                {notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Your notes</h3>
                    <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{notes}</p>
                  </div>
                )}

                {reflections.filter(Boolean).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Your reflections</h3>
                    <div className="grid gap-2">
                      {reflections.filter(Boolean).map((r, i) => (
                        <p key={i} className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{r}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 flex-wrap pt-2">
                  <Link
                    href={`/dashboard?language=${rec.language}`}
                    className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800"
                  >
                    Return to dashboard
                  </Link>
                  <Link
                    href={`/recommendations?language=${rec.language}`}
                    className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-white text-slate-950 text-sm font-semibold border border-slate-200 hover:bg-slate-100"
                  >
                    More recommendations
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
