import { languages, productStages, seedLessons, seedRecommendations } from "@yapper/shared";

export default function AdminHome() {
  const publishedLessons = seedLessons.filter((lesson) => lesson.status === "published");
  const seedOnlyLessons = seedLessons.filter((lesson) => lesson.status === "seed");

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: 32 }}>
      <p style={{ color: "#38bdf8", fontWeight: 700 }}>Yapper Admin</p>
      <h1 style={{ fontSize: 48, margin: 0 }}>Content operations dashboard</h1>
      <p style={{ color: "#94a3b8", fontSize: 18 }}>Phase 1 now has seed learning content, lesson tracks, and media recommendations wired into the shared catalog.</p>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 32 }}>
        <div style={{ border: "1px solid #334155", borderRadius: 24, padding: 24 }}>
          <strong>Languages</strong>
          <p>{Object.keys(languages).length} configured</p>
        </div>
        <div style={{ border: "1px solid #334155", borderRadius: 24, padding: 24 }}>
          <strong>Product stages</strong>
          <p>{productStages.length} configured</p>
        </div>
        <div style={{ border: "1px solid #334155", borderRadius: 24, padding: 24 }}>
          <strong>Lessons</strong>
          <p>{publishedLessons.length} published · {seedOnlyLessons.length} seed</p>
        </div>
        <div style={{ border: "1px solid #334155", borderRadius: 24, padding: 24 }}>
          <strong>Recommendations</strong>
          <p>{seedRecommendations.length} media items</p>
        </div>
      </section>

      <section style={{ marginTop: 32, display: "grid", gap: 12 }}>
        <h2>Seed lesson catalog</h2>
        {seedLessons.map((lesson) => (
          <div key={lesson.id} style={{ border: "1px solid #334155", borderRadius: 18, padding: 18, display: "flex", justifyContent: "space-between", gap: 16 }}>
            <div>
              <strong>{lesson.title}</strong>
              <p style={{ color: "#94a3b8", margin: "6px 0 0" }}>{lesson.language.toUpperCase()} · {lesson.stageSlug} · {lesson.steps.length} steps</p>
            </div>
            <span style={{ color: lesson.status === "published" ? "#86efac" : "#fbbf24" }}>{lesson.status}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
