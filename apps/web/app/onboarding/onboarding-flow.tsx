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
    <section className="twoGrid">
      <div className="card stack">
        <span className="badge">Two-minute placement</span>
        <h1 style={{ fontSize: 48, lineHeight: 1, margin: 0 }}>Start with the right kind of input.</h1>
        <p className="muted">This quick onboarding keeps the product aligned with your acquisition stage instead of forcing everyone through the same drills.</p>

        <div className="stack">
          <h2>1. Pick a language</h2>
          <div className="grid">
            {Object.values(languages).map((item) => (
              <button className={`option ${language === item.code ? "selected" : ""}`} key={item.code} onClick={() => setLanguage(item.code)}>
                <strong>{item.englishName}</strong>
                <div className="muted">{item.nativeName} · {item.launchTier === "mvp" ? "Phase 1 ready" : "seed"}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="stack">
          <h2>2. What is your current level?</h2>
          {experienceOptions.map(([value, label]) => (
            <button className={`option ${experience === value ? "selected" : ""}`} key={value} onClick={() => setExperience(value)}>{label}</button>
          ))}
        </div>

        <div className="stack">
          <h2>3. Why are you learning?</h2>
          <select className="option" value={goal} onChange={(event) => setGoal(event.target.value)}>
            {goals.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <button className="button" onClick={finish}>Create my path</button>
      </div>

      <aside className="card stack">
        <p className="kicker">Placement preview</p>
        <h2>{placement}</h2>
        <p className="muted">Target language: {languages[language].englishName}</p>
        <p className="muted">Goal: {goal}</p>
        <div className="progressTrack"><div className="progressFill" style={{ width: experience === "new" ? "18%" : experience === "some" ? "38%" : "56%" }} /></div>
        <p>The dashboard will start with immersion, vocabulary, and a tiny story reader.</p>
      </aside>
    </section>
  );
}
