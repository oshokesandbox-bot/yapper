"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { languages, type LanguageCode } from "@yapper/shared";

const goals = ["Understand movies", "Speak with family", "Travel", "School support", "Culture and music"] as const;
const experienceOptions = [
  ["new", "I know almost nothing"],
  ["some", "I know a few words or letters"],
  ["comfortable", "I can read simple phrases"]
] as const;

export function OnboardingFlow() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageCode>("es");
  const [experience, setExperience] = useState("new");
  const [goal, setGoal] = useState<string>(goals[0]);

  const placement = useMemo(() => {
    if (experience === "comfortable") return "Stage 3: Core Vocabulary";
    if (experience === "some") return "Stage 2: Literacy & Sounds";
    return "Stage 1: Immersion";
  }, [experience]);

  function finish() {
    localStorage.setItem("yapper:onboarding", JSON.stringify({ language, experience, goal, placement }));
    router.push(`/dashboard?language=${language}`);
  }

  return (
    <section className="grid grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-4 max-sm:grid-cols-1">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4">
        <span className="justify-self-start rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900">Two-minute placement</span>
        <h1 className="text-5xl leading-none m-0">Start with the right kind of input.</h1>
        <p className="text-slate-400 text-sm">This quick onboarding keeps the product aligned with your acquisition stage instead of forcing everyone through the same drills.</p>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">1. Pick a language</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3">
            {Object.values(languages).map((item) => (
              <button
                className={`w-full text-left border rounded-2xl p-4 cursor-pointer transition-colors ${
                  language === item.code ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"
                }`}
                key={item.code}
                onClick={() => setLanguage(item.code)}
              >
                <strong>{item.englishName}</strong>
                <div className="text-slate-400 text-sm">{item.nativeName} &middot; {item.launchTier === "mvp" ? "Phase 1 ready" : "seed"}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">2. What is your current level?</h2>
          {experienceOptions.map(([value, label]) => (
            <button
              className={`w-full text-left border rounded-2xl p-4 cursor-pointer transition-colors ${
                experience === value ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"
              }`}
              key={value}
              onClick={() => setExperience(value)}
            >{label}</button>
          ))}
        </div>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">3. Why are you learning?</h2>
          <select
            className="w-full text-left border border-slate-200 rounded-2xl p-4 cursor-pointer bg-white"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
          >
            {goals.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <button onClick={finish} className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 self-start mt-2 cursor-pointer">Create my path</button>
      </div>

      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4">
        <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Placement preview</p>
        <h2 className="text-2xl font-semibold">{placement}</h2>
        <p className="text-slate-400 text-sm">Target language: {languages[language].englishName}</p>
        <p className="text-slate-400 text-sm">Goal: {goal}</p>
        <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400" style={{ width: experience === "new" ? "18%" : experience === "some" ? "38%" : "56%" }} />
        </div>
        <p className="text-sm text-slate-500">The dashboard will start with immersion, vocabulary, and a tiny story reader.</p>
      </aside>
    </section>
  );
}
