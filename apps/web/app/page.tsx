import Link from "next/link";
import { languages, productStages, seedRecommendations } from "@yapper/shared";

export default function HomePage() {
  const mvpLanguages = Object.values(languages).filter((language) => language.launchTier === "mvp");

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 pb-16">
      <nav className="flex items-center justify-between gap-4 mb-10 max-sm:flex-col max-sm:items-start">
        <Link href="/" className="text-2xl font-black tracking-tighter">Yapper</Link>
        <div className="flex gap-4 text-sm text-slate-500">
          <Link href="/languages">Languages</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/onboarding">Start</Link>
        </div>
      </nav>

      <section className="grid gap-4">
        <span className="justify-self-start rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900">Immersion-first language learning</span>
        <h1 className="max-w-3xl text-[clamp(42px,8vw,76px)] leading-[0.95] tracking-tighter m-0">Learn languages the way humans naturally learn them.</h1>
        <p className="max-w-2xl text-slate-500 text-xl leading-relaxed">
          Yapper starts with context-rich immersion, then builds sounds, vocabulary, simple sentences, dictionary skills, and comprehension.
        </p>
        <div className="flex gap-3 flex-wrap items-center mt-2">
          <Link href="/onboarding" className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800">Start onboarding</Link>
          <Link href="/languages" className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-white text-slate-950 text-sm font-semibold border border-slate-200 hover:bg-slate-100">Explore languages</Link>
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4 mt-14">
        {productStages.slice(0, 5).map((stage) => (
          <section key={stage.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Step {stage.userStep}</p>
            <h2 className="text-xl font-semibold mt-1">{stage.label}</h2>
            <p className="text-slate-400 text-sm mt-1">{stage.purpose}</p>
          </section>
        ))}
      </section>

      <section className="grid grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-4 mt-14 max-sm:grid-cols-1">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Phase 1 is live</p>
          <h2 className="text-2xl font-semibold mt-1">Try the first learner loop</h2>
          <p className="text-slate-400 text-sm mt-1">Choose a language, get placed into the first stage, open your dashboard, and complete a seed immersion/vocabulary lesson.</p>
          <div className="flex gap-3 flex-wrap items-center mt-4">
            {mvpLanguages.map((language) => (
              <Link key={language.code} href={`/dashboard?language=${language.code}`} className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-100 text-slate-950 text-sm font-semibold hover:bg-slate-200">
                {language.englishName}
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Media angle</p>
          <h2 className="text-2xl font-semibold mt-1">{seedRecommendations[0]?.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{seedRecommendations[0]?.reason}</p>
        </section>
      </section>
    </main>
  );
}
