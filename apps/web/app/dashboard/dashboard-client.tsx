"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  languages,
  lessonsForLanguage,
  productStages,
  recommendationsForLanguage,
  type LanguageCode
} from "@yapper/shared";
import { Progress } from "@yapper/ui";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://yapper-mc7e.onrender.com";

function isLanguageCode(value: string | null): value is LanguageCode {
  return Boolean(value && value in languages);
}

async function fetchProgress(token: string | null, language: LanguageCode): Promise<any[]> {
  if (!token) {
    const saved = localStorage.getItem("yapper:onboarding");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [{ language, stageId: null, completed: false, placement: parsed.placement ?? null }];
      } catch { /* fall through */ }
    }
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/api/progress?language=${language}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.progress ?? [];
    }
  } catch { /* fall through */ }
  return [];
}

export function DashboardClient() {
  const searchParams = useSearchParams();
  const requestedLanguage = searchParams.get("language");
  const selectedLanguage: LanguageCode = isLanguageCode(requestedLanguage) ? requestedLanguage : "es";
  const lessons = lessonsForLanguage(selectedLanguage);
  const recommendations = recommendationsForLanguage(selectedLanguage);
  const [apiState, setApiState] = useState<string>("checking live API\u2026");
  const [savedPlacement, setSavedPlacement] = useState<string | null>(null);
  const [realProgress, setRealProgress] = useState<any[] | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    try { return localStorage.getItem("yapper:token"); } catch { return null; }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("yapper:onboarding");
    if (saved) {
      try {
        setSavedPlacement(JSON.parse(saved).placement ?? null);
      } catch { setSavedPlacement(null); }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiUrl}/health`, { signal: controller.signal })
      .then((response) => setApiState(response.ok ? "live API connected" : "API unreachable"))
      .catch(() => setApiState("API sleeping or unreachable"));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setProgressLoading(true);
    fetchProgress(token, selectedLanguage).then((data) => {
      setRealProgress(data);
      setProgressLoading(false);
    });
  }, [token, selectedLanguage]);

  const completedPercent = useMemo(() => {
    if (realProgress && realProgress.length > 0) {
      return realProgress.filter((p: any) => p.completed).length / Math.max(lessons.length, 1) * 100;
    }
    return selectedLanguage === "es" ? 22 : selectedLanguage === "fr" ? 18 : 12;
  }, [realProgress, selectedLanguage, lessons.length]);

  return (
    <section className="grid gap-4">
      <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-4 max-sm:grid-cols-1">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4">
          <span className="justify-self-start rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900">Learner dashboard</span>
          <h1 className="text-5xl leading-none m-0">{languages[selectedLanguage].englishName} path</h1>
          <p className="text-slate-400 text-sm">{savedPlacement ?? "Stage 1: Immersion"} &middot; {apiState}</p>
          <Progress value={completedPercent} />
          <p className="text-sm text-slate-500">{Math.round(completedPercent)}% through the Phase 1 seed path.</p>
          <div className="flex gap-3 flex-wrap items-center">
            {Object.values(languages).map((language) => (
              <Link
                key={language.code}
                href={`/dashboard?language=${language.code}`}
                className={`inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-semibold ${
                  language.code === selectedLanguage
                    ? "bg-slate-950 text-white hover:bg-slate-800"
                    : "bg-slate-100 text-slate-950 hover:bg-slate-200"
                }`}
              >
                {language.englishName}
              </Link>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4">
          <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Today&rsquo;s immersion</p>
          {recommendations[0] ? (
            <>
              <h2 className="text-2xl font-semibold">{recommendations[0].title}</h2>
              <p className="text-slate-400 text-sm">{recommendations[0].reason}</p>
              <p className="text-sm"><strong>Challenge:</strong> {recommendations[0].challenge}</p>
              <Link href={`/recommendations/${recommendations[0].id}`} className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 self-start">Start immersion</Link>
            </>
          ) : (
            <p className="text-slate-400 text-sm">No recommendations available for this language yet.</p>
          )}
          <Link href={`/recommendations?language=${selectedLanguage}`} className="text-sm text-blue-600 hover:underline">Find more media &rarr;</Link>
        </aside>
      </div>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
        {productStages.slice(0, 4).map((stage, index) => (
          <section key={stage.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-2">
            <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Stage {stage.id}</p>
            <h2 className="text-xl font-semibold">{stage.label}</h2>
            <p className="text-slate-400 text-sm">{stage.purpose}</p>
            <Progress value={Math.max(8, completedPercent - index * 8)} />
          </section>
        ))}
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-2xl font-semibold">Continue learning</h2>
          <Link href="/onboarding" className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-white text-slate-950 text-sm font-semibold border border-slate-200 hover:bg-slate-100">Retake placement</Link>
        </div>
        {progressLoading && (
          <p className="text-slate-400 text-sm">Loading progress&hellip;</p>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
          {lessons.map((lesson) => (
            <section key={lesson.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-2">
              <p className="text-blue-600 font-black uppercase tracking-widest text-xs">{lesson.stageSlug.replaceAll("-", " ")} &middot; {lesson.estimatedMinutes} min</p>
              <h3 className="text-2xl m-0 font-semibold">{lesson.title}</h3>
              <p className="text-slate-400 text-sm">{lesson.subtitle}</p>
              <Link href={`/dashboard/lesson/${lesson.id}`} className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 self-start mt-2">Start lesson</Link>
            </section>
          ))}
        </div>
      </section>
    </section>
  );
}
