import Link from "next/link";
import { languages, productStages, seedRecommendations } from "@yapper/shared";

export default function HomePage() {
  const mvpLanguages = Object.values(languages).filter((language) => language.launchTier === "mvp");

  return (
    <main className="page">
      <nav className="nav">
        <Link className="logo" href="/">Yapper</Link>
        <div className="navLinks">
          <Link href="/languages">Languages</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/onboarding">Start</Link>
        </div>
      </nav>

      <section className="stack">
        <span className="badge">Immersion-first language learning</span>
        <h1 className="heroTitle">Learn languages the way humans naturally learn them.</h1>
        <p className="lead">
          Yapper starts with context-rich immersion, then builds sounds, vocabulary, simple sentences, dictionary skills, and comprehension.
        </p>
        <div className="row">
          <Link className="button" href="/onboarding">Start onboarding</Link>
          <Link className="button secondary" href="/languages">Explore languages</Link>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 56 }}>
        {productStages.slice(0, 5).map((stage) => (
          <section className="card" key={stage.slug}>
            <p className="kicker">Step {stage.userStep}</p>
            <h2>{stage.label}</h2>
            <p className="muted">{stage.purpose}</p>
          </section>
        ))}
      </section>

      <section className="twoGrid" style={{ marginTop: 56 }}>
        <section className="card">
          <p className="kicker">Phase 1 is live</p>
          <h2>Try the first learner loop</h2>
          <p className="muted">Choose a language, get placed into the first stage, open your dashboard, and complete a seed immersion/vocabulary lesson.</p>
          <div className="row">
            {mvpLanguages.map((language) => (
              <Link className="button ghost" key={language.code} href={`/dashboard?language=${language.code}`}>
                {language.englishName}
              </Link>
            ))}
          </div>
        </section>
        <section className="card">
          <p className="kicker">Media angle</p>
          <h2>{seedRecommendations[0]?.title}</h2>
          <p className="muted">{seedRecommendations[0]?.reason}</p>
        </section>
      </section>
    </main>
  );
}
