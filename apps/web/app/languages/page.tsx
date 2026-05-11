import Link from "next/link";
import { languages, lessonsForLanguage, recommendationsForLanguage } from "@yapper/shared";

export default function LanguagesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 pb-16">
      <nav className="flex items-center justify-between gap-4 mb-10 max-sm:flex-col max-sm:items-start">
        <Link href="/" className="text-2xl font-black tracking-tighter">Yapper</Link>
        <div className="flex gap-4 text-sm text-slate-500">
          <Link href="/onboarding">Start</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>
      <section className="grid gap-4">
        <span className="justify-self-start rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900">Choose your target language</span>
        <h1 className="max-w-3xl text-[clamp(42px,8vw,76px)] leading-[0.95] tracking-tighter m-0">Five languages, one acquisition path.</h1>
        <p className="max-w-2xl text-slate-500 text-xl leading-relaxed">Spanish, French, and English have full Phase 1 tracks. German and Russian are wired as seed tracks so the product supports all five from the start.</p>
      </section>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4 mt-10">
        {Object.values(languages).map((language) => (
          <section key={language.code} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-2">
            <p className="text-blue-600 font-black uppercase tracking-widest text-xs">{language.launchTier === "mvp" ? "MVP track" : "Seed track"}</p>
            <h2 className="text-xl font-semibold">{language.englishName}</h2>
            <p className="text-slate-400 text-sm">{language.nativeName} &middot; {language.script} script</p>
            <p className="text-slate-500 text-sm">{lessonsForLanguage(language.code).length} seed lessons &middot; {recommendationsForLanguage(language.code).length} media recommendation</p>
            <Link href={`/dashboard?language=${language.code}`} className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 self-start mt-2">Open track</Link>
          </section>
        ))}
      </section>
    </main>
  );
}
