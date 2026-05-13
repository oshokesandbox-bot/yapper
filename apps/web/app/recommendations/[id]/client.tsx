"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Card, CardContent, CardDescription, CardTitle } from "@yapper/ui";
import { productStages, seedRecommendations, type LanguageCode, type MediaRecommendation } from "@yapper/shared";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://yapper-mc7e.onrender.com";

const mediaTypeIcons: Record<string, string> = {
  movie: "🎬",
  series: "📺",
  book: "📖",
  music: "🎵",
  podcast: "🎙️"
};

type RecommendationDetail = MediaRecommendation & {
  stageLabel: string | null;
};

export function RecommendationDetailClient() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [rec, setRec] = useState<RecommendationDetail | null>(null);
  const [related, setRelated] = useState<MediaRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    fetch(`${apiUrl}/api/recommendations/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setRec(data.recommendation);
        setRelated(data.related ?? []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to seed data
        const seed = seedRecommendations.find((r) => r.id === id);
        if (seed) {
          const stage = productStages.find((s) => s.slug === seed.stageSlug);
          setRec({ ...seed, stageLabel: stage?.label ?? null });
          setRelated(seedRecommendations.filter((r) => r.language === seed.language && r.id !== seed.id).slice(0, 3));
        } else {
          setError(true);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 pb-16">
        <p className="text-slate-400">Loading&hellip;</p>
      </main>
    );
  }

  if (error || !rec) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 pb-16">
        <nav className="flex items-center justify-between gap-4 mb-10">
          <Link href="/" className="text-2xl font-black tracking-tighter">Yapper</Link>
          <Link href="/recommendations" className="text-sm text-slate-500 hover:text-slate-800">Back to recommendations</Link>
        </nav>
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <h1 className="text-2xl font-semibold mb-1">Recommendation not found</h1>
          <p className="text-slate-400 mb-4">This media recommendation doesn&apos;t exist or was removed.</p>
          <Link href="/recommendations" className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800">
            Browse recommendations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 pb-16">
      <nav className="flex items-center justify-between gap-4 mb-10 max-sm:flex-col max-sm:items-start">
        <Link href="/" className="text-2xl font-black tracking-tighter">Yapper</Link>
        <Link href={`/recommendations?language=${rec.language}`} className="text-sm text-slate-500 hover:text-slate-800">
          &larr; Back to recommendations
        </Link>
      </nav>

      <Card>
        <CardContent className="grid gap-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex gap-2 flex-wrap mb-2">
                <Badge variant="default">{rec.language.toUpperCase()}</Badge>
                <Badge variant="secondary">{mediaTypeIcons[rec.mediaType]} {rec.mediaType}</Badge>
              </div>
              <h1 className="text-3xl font-semibold mb-1">{rec.title}</h1>
              {rec.stageLabel && (
                <p className="text-sm text-blue-600 font-medium">Suggested stage: {rec.stageLabel}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <h2 className="text-lg font-semibold mb-1">Why this recommendation?</h2>
            <p className="text-slate-600">{rec.reason}</p>
          </div>

          {/* Challenge */}
          {rec.challenge && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <h2 className="text-lg font-semibold mb-1 text-amber-900">Your watch challenge</h2>
              <p className="text-amber-800">{rec.challenge}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/immerse/${rec.id}`}
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800"
            >
              Watch &amp; Report
            </Link>
            {rec.affiliateUrl && (
              <a
                href={rec.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-slate-950 text-sm font-semibold border border-slate-200 hover:bg-slate-100"
              >
                Find on streaming
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Related recommendations */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">More for {rec.language.toUpperCase()}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {related.map((r) => (
              <Link key={r.id} href={`/recommendations/${r.id}`} className="block">
                <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-blue-300 h-full">
                  <CardContent>
                    <div className="flex gap-2 flex-wrap mb-2">
                      <Badge variant="default">{r.language.toUpperCase()}</Badge>
                      <Badge variant="secondary">{r.mediaType}</Badge>
                    </div>
                    <CardTitle className="text-lg mb-1">{r.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{r.reason}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
