import { seedLessons, seedRecommendations } from "@yapper/shared";

export default function ContentPage() {
  return (
    <main style={{ padding: 32, maxWidth: 1120, margin: "0 auto" }}>
      <h1>Content review queue</h1>
      <p style={{ color: "#94a3b8" }}>Temporary Phase 1 admin view. Full approve/edit/reject workflow comes next.</p>
      <section style={{ display: "grid", gap: 12, marginTop: 24 }}>
        {seedLessons.map((lesson) => (
          <article key={lesson.id} style={{ border: "1px solid #334155", borderRadius: 18, padding: 18 }}>
            <strong>{lesson.title}</strong>
            <p style={{ color: "#94a3b8" }}>{lesson.subtitle}</p>
            <p>{lesson.steps.length} steps · {lesson.estimatedMinutes} minutes · {lesson.status}</p>
          </article>
        ))}
      </section>
      <h2 style={{ marginTop: 36 }}>Media recommendations</h2>
      <section style={{ display: "grid", gap: 12 }}>
        {seedRecommendations.map((item) => (
          <article key={item.id} style={{ border: "1px solid #334155", borderRadius: 18, padding: 18 }}>
            <strong>{item.title}</strong>
            <p style={{ color: "#94a3b8" }}>{item.language.toUpperCase()} · {item.mediaType} · {item.stageSlug}</p>
            <p>{item.reason}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
