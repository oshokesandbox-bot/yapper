"use client";

import { useEffect, useState } from "react";
import { seedLessons, seedRecommendations, languages, type LanguageCode, type MediaRecommendation } from "@yapper/shared";
import { Badge, Button, Dialog, DialogHeader, DialogTitle, Input, Label } from "@yapper/ui";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://yapper-mc7e.onrender.com";

function computeMediaTypeColor(type: string): string {
  const colors: Record<string, string> = {
    movie: "text-blue-400",
    series: "text-green-400",
    book: "text-amber-400",
    music: "text-purple-400",
    podcast: "text-pink-400"
  };
  return colors[type] ?? "text-slate-400";
}

const mediaTypes = ["movie", "series", "book", "music", "podcast"] as const;

export default function AdminContentPage() {
  const [recommendations, setRecommendations] = useState<MediaRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRec, setEditingRec] = useState<MediaRecommendation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    language: "es" as LanguageCode,
    mediaType: "movie" as string,
    reason: "",
    challenge: "",
    affiliateUrl: "",
    stageHintId: ""
  });

  function loadRecommendations() {
    setLoading(true);
    fetch(`${apiUrl}/api/recommendations`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations ?? []);
        setLoading(false);
      })
      .catch(() => {
        setRecommendations(seedRecommendations);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadRecommendations();
  }, []);

  function resetForm() {
    setForm({
      title: "",
      language: "es",
      mediaType: "movie",
      reason: "",
      challenge: "",
      affiliateUrl: "",
      stageHintId: ""
    });
    setEditingRec(null);
  }

  async function handleSave() {
    const token = localStorage.getItem("yapper:accessToken");

    // For now, just log what would be saved (admin API endpoint TBD)
    console.log("Saving recommendation:", form);

    // Optimistic UI update
    const newRec: MediaRecommendation = {
      id: editingRec?.id ?? `local-${Date.now()}`,
      language: form.language,
      title: form.title,
      mediaType: form.mediaType as MediaRecommendation["mediaType"],
      reason: form.reason,
      challenge: form.challenge,
      affiliateUrl: form.affiliateUrl || undefined,
      stageHintId: form.stageHintId ? parseInt(form.stageHintId, 10) : undefined,
      stageSlug: "immersion"
    };

    if (editingRec) {
      setRecommendations((prev) => prev.map((r) => r.id === editingRec.id ? newRec : r));
    } else {
      setRecommendations((prev) => [...prev, newRec]);
    }

    setShowForm(false);
    resetForm();
  }

  function handleEdit(rec: MediaRecommendation) {
    setEditingRec(rec);
    setForm({
      title: rec.title,
      language: rec.language,
      mediaType: rec.mediaType,
      reason: rec.reason,
      challenge: rec.challenge ?? "",
      affiliateUrl: rec.affiliateUrl ?? "",
      stageHintId: rec.stageHintId?.toString() ?? ""
    });
    setShowForm(true);
  }

  function handleDelete(recId: string) {
    setRecommendations((prev) => prev.filter((r) => r.id !== recId));
  }

  return (
    <main className="mx-auto max-w-5xl px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Content management</h1>
          <p className="text-slate-400">Manage lessons, recommendations, and immersion content.</p>
        </div>
      </div>

      {/* Lessons section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Lessons ({seedLessons.length})</h2>
        <div className="grid gap-3">
          {seedLessons.map((lesson) => (
            <article key={lesson.id} className="border border-slate-700 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <strong>{lesson.title}</strong>
                  <p className="text-slate-400 text-sm">{lesson.subtitle}</p>
                  <p className="text-sm mt-1">
                    {lesson.steps.length} steps &middot; {lesson.estimatedMinutes} minutes &middot;
                    <span className={lesson.status === "published" ? "text-green-300" : "text-amber-300"}> {lesson.status}</span>
                    <span className="text-slate-500"> &middot; {lesson.language.toUpperCase()} &middot; {lesson.stageSlug}</span>
                  </p>
                </div>
                <Badge variant={lesson.status === "published" ? "default" : "secondary"}>
                  {lesson.status}
                </Badge>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Recommendations section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            Media recommendations{" "}
            {!loading && <span className="text-slate-400 text-lg">({recommendations.length})</span>}
          </h2>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            Add recommendation
          </Button>
        </div>

        {loading && <p className="text-slate-400">Loading recommendations from API...</p>}

        <div className="grid gap-3">
          {recommendations.map((rec) => (
            <article key={rec.id} className="border border-slate-700 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <strong>{rec.title}</strong>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="text-slate-400 text-sm">{rec.language.toUpperCase()}</span>
                    <span className={`text-sm ${computeMediaTypeColor(rec.mediaType)}`}>{rec.mediaType}</span>
                    {rec.stageHintId && <span className="text-slate-500 text-sm">Stage hint: {rec.stageHintId}</span>}
                  </div>
                  <p className="text-sm mt-1 text-slate-400">{rec.reason}</p>
                  {rec.challenge && <p className="text-xs mt-1 text-amber-400">Challenge: {rec.challenge}</p>}
                  {rec.affiliateUrl && <p className="text-xs text-blue-400 mt-1">{rec.affiliateUrl}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(rec)}
                    className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-slate-700 text-xs text-slate-200 hover:bg-slate-600 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-red-900 text-xs text-red-200 hover:bg-red-800 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && recommendations.length === 0 && (
          <p className="text-slate-500 text-center py-8">No recommendations yet. Add your first one!</p>
        )}
      </section>

      {/* Recommendation form dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) resetForm(); }}>
        <DialogHeader>
          <DialogTitle>{editingRec ? "Edit recommendation" : "Add recommendation"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-4">
          <Input
            id="rec-title"
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Coco, Amélie, etc."
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="rec-language">Language</Label>
              <select
                id="rec-language"
                className="mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm"
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value as LanguageCode }))}
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code}>{lang.englishName}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="rec-mediatype">Media type</Label>
              <select
                id="rec-mediatype"
                className="mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm"
                value={form.mediaType}
                onChange={(e) => setForm((f) => ({ ...f, mediaType: e.target.value }))}
              >
                {mediaTypes.map((type) => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="rec-reason">Reason for recommendation</Label>
            <textarea
              id="rec-reason"
              className="mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm placeholder:text-slate-500 min-h-[60px]"
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="Why is this good for language immersion?"
            />
          </div>

          <div>
            <Label htmlFor="rec-challenge">Challenge text</Label>
            <textarea
              id="rec-challenge"
              className="mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm placeholder:text-slate-500 min-h-[60px]"
              value={form.challenge}
              onChange={(e) => setForm((f) => ({ ...f, challenge: e.target.value }))}
              placeholder="Watch the scene and notice..."
            />
          </div>

          <Input
            id="rec-affiliate"
            label="Affiliate URL (optional)"
            value={form.affiliateUrl}
            onChange={(e) => setForm((f) => ({ ...f, affiliateUrl: e.target.value }))}
            placeholder="https://..."
          />

          <Input
            id="rec-stage"
            label="Stage hint ID (optional)"
            value={form.stageHintId}
            onChange={(e) => setForm((f) => ({ ...f, stageHintId: e.target.value }))}
            placeholder="1, 2, 3..."
          />

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={() => { setShowForm(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingRec ? "Save changes" : "Add recommendation"}
            </Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
