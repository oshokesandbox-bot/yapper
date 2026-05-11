import Link from "next/link";
import { languages, lessonsForLanguage, recommendationsForLanguage } from "@yapper/shared";

export default function LanguagesPage() {
  return (
    <main className="page">
      <nav className="nav">
        <Link className="logo" href="/">Yapper</Link>
        <div className="navLinks"><Link href="/onboarding">Start</Link><Link href="/dashboard">Dashboard</Link></div>
      </nav>
      <section className="stack">
        <span className="badge">Choose your target language</span>
        <h1 className="heroTitle">Five languages, one acquisition path.</h1>
        <p className="lead">Spanish, French, and English have full Phase 1 tracks. German and Russian are wired as seed tracks so the product supports all five from the start.</p>
      </section>
      <section className="grid" style={{ marginTop: 40 }}>
        {Object.values(languages).map((language) => (
          <section className="card" key={language.code}>
            <p className="kicker">{language.launchTier === "mvp" ? "MVP track" : "Seed track"}</p>
            <h2>{language.englishName}</h2>
            <p className="muted">{language.nativeName} · {language.script} script</p>
            <p>{lessonsForLanguage(language.code).length} seed lessons · {recommendationsForLanguage(language.code).length} media recommendation</p>
            <Link className="button" href={`/dashboard?language=${language.code}`}>Open track</Link>
          </section>
        ))}
      </section>
    </main>
  );
}
