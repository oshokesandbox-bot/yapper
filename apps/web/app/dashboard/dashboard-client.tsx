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

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://yapper-mc7e.onrender.com";

function isLanguageCode(value: string | null): value is LanguageCode {
  return Boolean(value && value in languages);
}

export function DashboardClient() {
  const searchParams = useSearchParams();
  const requestedLanguage = searchParams.get("language");
  const selectedLanguage: LanguageCode = isLanguageCode(requestedLanguage) ? requestedLanguage : "es";
  const lessons = lessonsForLanguage(selectedLanguage);
  const recommendations = recommendationsForLanguage(selectedLanguage);
  const [apiState, setApiState] = useState("checking live API…");
  const [savedPlacement, setSavedPlacement] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("yapper:onboarding");
    if (saved) {
      try {
        setSavedPlacement(JSON.parse(saved).placement ?? null);
      } catch {
        setSavedPlacement(null);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiUrl}/health`, { signal: controller.signal })
      .then((response) => setApiState(response.ok ? "live API connected" : "API unreachable"))
      .catch(() => setApiState("API sleeping or unreachable"));
    return () => controller.abort();
  }, []);

  const completedPercent = useMemo(() => selectedLanguage === "es" ? 22 : selectedLanguage === "fr" ? 18 : 12, [selectedLanguage]);

  return (
    <section className="stack">
      <div className="twoGrid">
        <section className="card stack">
          <span className="badge">Learner dashboard</span>
          <h1 style={{ fontSize: 52, lineHeight: 1, margin: 0 }}>{languages[selectedLanguage].englishName} path</h1>
          <p className="muted">{savedPlacement ?? "Stage 1: Immersion"} · {apiState}</p>
          <div className="progressTrack"><div className="progressFill" style={{ width: `${completedPercent}%` }} /></div>
          <p>{completedPercent}% through the Phase 1 seed path.</p>
          <div className="row">
            {Object.values(languages).map((language) => (
              <Link className={`button ${language.code === selectedLanguage ? "" : "ghost"}`} href={`/dashboard?language=${language.code}`} key={language.code}>
                {language.englishName}
              </Link>
            ))}
          </div>
        </section>

        <aside className="card stack">
          <p className="kicker">Today’s immersion</p>
          <h2>{recommendations[0]?.title}</h2>
          <p className="muted">{recommendations[0]?.reason}</p>
          <p><strong>Challenge:</strong> {recommendations[0]?.challenge}</p>
        </aside>
      </div>

      <section className="grid">
        {productStages.slice(0, 4).map((stage, index) => (
          <section className="card" key={stage.slug}>
            <p className="kicker">Stage {stage.id}</p>
            <h2>{stage.label}</h2>
            <p className="muted">{stage.purpose}</p>
            <div className="progressTrack"><div className="progressFill" style={{ width: `${Math.max(8, completedPercent - index * 8)}%` }} /></div>
          </section>
        ))}
      </section>

      <section className="stack">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Continue learning</h2>
          <Link className="button secondary" href="/onboarding">Retake placement</Link>
        </div>
        <div className="grid">
          {lessons.map((lesson) => (
            <section className="card stack" key={lesson.id}>
              <p className="kicker">{lesson.stageSlug.replaceAll("-", " ")} · {lesson.estimatedMinutes} min</p>
              <h3 style={{ fontSize: 24, margin: 0 }}>{lesson.title}</h3>
              <p className="muted">{lesson.subtitle}</p>
              <Link className="button" href={`/dashboard/lesson/${lesson.id}`}>Start lesson</Link>
            </section>
          ))}
        </div>
      </section>
    </section>
  );
}
