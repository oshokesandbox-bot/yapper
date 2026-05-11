import { languages } from "@yapper/shared";

function Card({ children }: { children: React.ReactNode }) {
  return <section style={{ border: "1px solid #e2e8f0", borderRadius: 24, background: "white", padding: 24 }}>{children}</section>;
}

export default function LanguagesPage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32 }}>
      <h1>Languages</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {Object.values(languages).map((language) => (
          <Card key={language.code}>
            <h2>{language.englishName}</h2>
            <p>{language.nativeName}</p>
            <p>{language.launchTier === "mvp" ? "MVP content track" : "Seed/demo content first"}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
