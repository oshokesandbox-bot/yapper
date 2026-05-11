import { productStages } from "@yapper/shared";

function Card({ children }: { children: React.ReactNode }) {
  return <section style={{ border: "1px solid #e2e8f0", borderRadius: 24, background: "white", padding: 24 }}>{children}</section>;
}

export default function DashboardPage() {
  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 32 }}>
      <h1>Learner dashboard</h1>
      <p>Phase 0 placeholder for progress, next lesson, immersion recommendations, and review sessions.</p>
      <div style={{ display: "grid", gap: 12 }}>
        {productStages.map((stage) => (
          <Card key={stage.slug}>
            <strong>{stage.id}. {stage.label}</strong>
            <p style={{ marginBottom: 0 }}>{stage.purpose}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
