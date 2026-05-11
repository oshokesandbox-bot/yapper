import { seedLessons, seedRecommendations } from "@yapper/shared";

export default function ContentPage() {
  return (
    <main className="mx-auto max-w-5xl px-8 py-8">
      <h1 className="text-3xl font-semibold">Content review queue</h1>
      <p className="text-slate-400">Temporary Phase 1 admin view. Full approve/edit/reject workflow comes next.</p>
      <section className="grid gap-3 mt-6">
        {seedLessons.map((lesson) => (
          <article key={lesson.id} className="border border-slate-700 rounded-2xl p-4">
            <strong>{lesson.title}</strong>
            <p className="text-slate-400 text-sm">{lesson.subtitle}</p>
            <p className="text-sm mt-1">{lesson.steps.length} steps &middot; {lesson.estimatedMinutes} minutes &middot; {lesson.status}</p>
          </article>
        ))}
      </section>
      <h2 className="text-2xl font-semibold mt-9">Media recommendations</h2>
      <section className="grid gap-3 mt-4">
        {seedRecommendations.map((item) => (
          <article key={item.id} className="border border-slate-700 rounded-2xl p-4">
            <strong>{item.title}</strong>
            <p className="text-slate-400 text-sm">{item.language.toUpperCase()} &middot; {item.mediaType} &middot; {item.stageSlug}</p>
            <p className="text-sm mt-1">{item.reason}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
