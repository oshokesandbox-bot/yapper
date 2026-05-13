"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { languages, seedRecommendations, type LanguageCode, type MediaRecommendation } from "@yapper/shared";
import { Badge, Card, CardContent, CardDescription, CardTitle } from "@yapper/ui";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://yapper-mc7e.onrender.com";

function isLanguageCode(value: string | null): value is LanguageCode {
  return Boolean(value && value in languages);
}

const mediaTypeIcons: Record<string, string> = {
  movie: "🎬",
  series: "📺",
  book: "📖",
  music: "🎵",
  podcast: "🎙️"
};

const mediaTypes = ["all", "movie", "book", "podcast", "music", "series"] as const;

function RecommendationCard({ rec }: { rec: MediaRecommendation }) {
  return (
    <Link href={`/recommendations/${rec.id}`} className="block">
      <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-blue-300 h-full flex flex-col">
        <CardContent>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default">
                {rec.language.toUpperCase()}
              </Badge>
              <Badge variant="secondary">
                {mediaTypeIcons[rec.mediaType] ?? "🎬"} {rec.mediaType}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl mb-1">{rec.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-1">{rec.reason}</CardDescription>
          <p className="text-xs text-slate-400 mt-3 italic">Challenge: {rec.challenge?.slice(0, 60)}&hellip;</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const requestedLanguage = searchParams.get("language");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(
    isLanguageCode(requestedLanguage) ? requestedLanguage : "es"
  );
  const [selectedMediaType, setSelectedMediaType] = useState<string>("all");
  const [recommendations, setRecommendations] = useState<MediaRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLanguageCode(requestedLanguage)) {
      setSelectedLanguage(requestedLanguage);
    }
  }, [requestedLanguage]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ language: selectedLanguage });
    if (selectedMediaType !== "all") {
      params.set("mediaType", selectedMediaType);
    }

    fetch(`${apiUrl}/api/recommendations?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations ?? []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to seed data
        let filtered = seedRecommendations.filter((r) => r.language === selectedLanguage);
        if (selectedMediaType !== "all") {
          filtered = filtered.filter((r) => r.mediaType === selectedMediaType);
        }
        setRecommendations(filtered);
        setLoading(false);
      });
  }, [selectedLanguage, selectedMediaType]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 pb-16">
      <nav className="flex items-center justify-between gap-4 mb-10 max-sm:flex-col max-sm:items-start">
        <Link href="/" className="text-2xl font-black tracking-tighter">Yapper</Link>
        <div className="flex gap-4 text-sm text-slate-500">
          <Link href="/onboarding">Onboarding</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <section className="grid gap-6">
        <div>
          <h1 className="text-4xl font-semibold mb-2">Immersion recommendations</h1>
          <p className="text-slate-400">Curated media to build unconscious familiarity with your target language.</p>
        </div>

        {/* Language selector */}
        <div className="flex gap-3 flex-wrap items-center">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                lang.code === selectedLanguage
                  ? "bg-slate-950 text-white hover:bg-slate-800"
                  : "bg-slate-100 text-slate-950 hover:bg-slate-200"
              }`}
            >
              {lang.englishName}
            </button>
          ))}
        </div>

        {/* Media type filter */}
        <div className="flex gap-2 flex-wrap items-center">
          {mediaTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMediaType(type)}
              className={`inline-flex items-center justify-center h-8 px-4 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                type === selectedMediaType
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type === "all" ? "All" : `${mediaTypeIcons[type] ?? ""} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <p className="text-slate-400 text-sm py-8 text-center">Loading recommendations&hellip;</p>
        )}

        {/* Empty state */}
        {!loading && recommendations.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <h2 className="text-xl font-semibold mb-1">No recommendations yet</h2>
            <p className="text-slate-400">Try a different language or media type filter.</p>
          </div>
        )}

        {/* Recommendation grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-5xl px-6 py-10 pb-16">
        <p className="text-slate-400">Loading recommendations&hellip;</p>
      </main>
    }>
      <RecommendationsContent />
    </Suspense>
  );
}
