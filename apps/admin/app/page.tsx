import { languages, productStages, seedLessons, seedRecommendations } from "@yapper/shared";

export default function AdminHome() {
  const publishedLessons = seedLessons.filter((lesson) => lesson.status === "published");
  const seedOnlyLessons = seedLessons.filter((lesson) => lesson.status === "seed");

  return (
    <main className="mx-auto max-w-5xl px-8 py-8">
      <p className="text-sky-400 font-bold">Yapper Admin</p>
      <h1 className="text-5xl m-0 font-semibold">Content operations dashboard</h1>
      <p className="text-slate-400 text-lg">Phase 1 now has seed learning content, lesson tracks, and media recommendations wired into the shared catalog.</p>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mt-8">
        <div className="border border-slate-700 rounded-3xl p-6">
          <strong className="text-lg">Languages</strong>
          <p className="text-slate-400 mt-1">{Object.keys(languages).length} configured</p>
        </div>
        <div className="border border-slate-700 rounded-3xl p-6">
          <strong className="text-lg">Product stages</strong>
          <p className="text-slate-400 mt-1">{productStages.length} configured</p>
        </div>
        <div className="border border-slate-700 rounded-3xl p-6">
          <strong className="text-lg">Lessons</strong>
          <p className="text-slate-400 mt-1">{publishedLessons.length} published &middot; {seedOnlyLessons.length} seed</p>
        </div>
        <div className="border border-slate-700 rounded-3xl p-6">
          <strong className="text-lg">Recommendations</strong>
          <p className="text-slate-400 mt-1">{seedRecommendations.length} media items</p>
        </div>
      </section>

      <section className="mt-8 grid gap-3">
        <h2 className="text-2xl font-semibold">Seed lesson catalog</h2>
        {seedLessons.map((lesson) => (
          <div key={lesson.id} className="border border-slate-700 rounded-2xl p-4 flex justify-between gap-4 items-start">
            <div>
              <strong>{lesson.title}</strong>
              <p className="text-slate-400 text-sm mt-1">{lesson.language.toUpperCase()} &middot; {lesson.stageSlug} &middot; {lesson.steps.length} steps</p>
            </div>
            <span className={lesson.status === "published" ? "text-green-300" : "text-amber-300"}>{lesson.status}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
