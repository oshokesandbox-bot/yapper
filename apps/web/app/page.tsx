import { languages, productStages } from "@yapper/shared";

function Badge({ children }: { children: React.ReactNode }) {
  return <span style={{ alignSelf: "flex-start", borderRadius: 999, background: "#fef3c7", color: "#78350f", padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>{children}</span>;
}

function Button({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return <button style={{ border: variant === "primary" ? "0" : "1px solid #e2e8f0", borderRadius: 999, background: variant === "primary" ? "#020617" : "white", color: variant === "primary" ? "white" : "#020617", padding: "12px 20px", fontWeight: 700 }}>{children}</button>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <section style={{ border: "1px solid #e2e8f0", borderRadius: 24, background: "white", padding: 24, boxShadow: "0 1px 2px rgb(15 23 42 / 0.06)" }}>{children}</section>;
}

export default function HomePage() {
  const mvpLanguages = Object.values(languages).filter((language) => language.launchTier === "mvp");

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 24px" }}>
      <section style={{ display: "grid", gap: 24 }}>
        <Badge>Immersion-first language learning</Badge>
        <h1 style={{ maxWidth: 780, fontSize: 64, lineHeight: 1, letterSpacing: "-0.05em", margin: 0 }}>
          Learn languages the way humans naturally learn them.
        </h1>
        <p style={{ maxWidth: 680, color: "#475569", fontSize: 20, lineHeight: 1.6 }}>
          Yapper starts with context-rich immersion, then builds sounds, vocabulary, simple sentences, dictionary skills, and comprehension.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button>Start learning</Button>
          <Button variant="secondary">Explore languages</Button>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 56 }}>
        {productStages.slice(0, 5).map((stage) => (
          <Card key={stage.slug}>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Step {stage.userStep}</p>
            <h2 style={{ margin: "8px 0", fontSize: 20 }}>{stage.label}</h2>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>{stage.purpose}</p>
          </Card>
        ))}
      </section>

      <section style={{ marginTop: 56 }}>
        <h2>Launch languages</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {mvpLanguages.map((language) => (
            <Card key={language.code}>
              <strong>{language.englishName}</strong>
              <p style={{ margin: "4px 0 0", color: "#64748b" }}>{language.nativeName}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
