"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import type { Lesson, LessonStep } from "@yapper/shared";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://yapper-mc7e.onrender.com";

async function saveProgress(language: string, lessonId: string): Promise<void> {
  const token = localStorage.getItem("yapper:token");
  try {
    await fetch(`${apiUrl}/api/progress/lesson`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ language, lessonId }),
    });
  } catch { /* save best-effort */ }
}

function StepContent({ step }: { step: LessonStep }) {
  if (step.type === "immersion") {
    return (
      <div className="grid gap-4 min-h-[360px] content-start">
        <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Immersion</p>
        <h2 className="text-2xl font-semibold">{step.title}</h2>
        <p className="text-slate-400 text-sm">{step.instruction}</p>
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-semibold">{step.mediaTitle}</h3>
          <p className="text-sm text-slate-500 mt-1">Watch target: {step.mediaType}</p>
          {step.watchUrl ? <a className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 mt-3 inline-block" href={step.watchUrl} target="_blank" rel="noreferrer">Open suggested search</a> : null}
        </section>
        <ul className="list-disc pl-5 grid gap-1 text-sm">
          {step.focus.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    );
  }

  if (step.type === "vocabulary") {
    return (
      <div className="grid gap-4 min-h-[360px] content-start">
        <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Vocabulary</p>
        <h2 className="text-2xl font-semibold">{step.title}</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
          {step.cards.map((card) => (
            <section key={card.term} className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
              <h3 className="text-3xl m-0">{card.term}</h3>
              <p className="font-semibold">{card.translation}</p>
              <p className="text-slate-400 text-sm">{card.concept} &middot; {card.pronunciationHint}</p>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (step.type === "story") {
    return (
      <div className="grid gap-4 min-h-[360px] content-start">
        <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Simple reader</p>
        <h2 className="text-2xl font-semibold">{step.title}</h2>
        <p className="text-2xl leading-relaxed">{step.text}</p>
        <div className="flex gap-2 flex-wrap">
          {step.glossary.map((item) => (
            <span key={item.term} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{item.term}: {item.translation}</span>
          ))}
        </div>
      </div>
    );
  }

  return <QuizStep step={step} />;
}

function QuizStep({ step }: { step: Extract<LessonStep, { type: "quiz" }> }) {
  const [selected, setSelected] = useState<string | null>(null);
  const isCorrect = selected === step.answer;

  return (
    <div className="grid gap-4 min-h-[360px] content-start">
      <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Check understanding</p>
      <h2 className="text-2xl font-semibold">{step.title}</h2>
      <p>{step.prompt}</p>
      <div className="grid gap-3">
        {step.options.map((option) => (
          <button
            key={option}
            className={`w-full text-left border rounded-2xl p-4 cursor-pointer transition-colors ${
              selected === option ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"
            }`}
            onClick={() => setSelected(option)}
          >{option}</button>
        ))}
      </div>
      {selected ? (
        <section className={`rounded-3xl border p-6 ${isCorrect ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
          <strong>{isCorrect ? "Good inference." : "Not quite \u2014 try the context again."}</strong>
          <p className="text-sm mt-1">{step.explanation}</p>
        </section>
      ) : null}
    </div>
  );
}

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const step = lesson.steps[index] ?? lesson.steps[0];
  const progress = useMemo(() => Math.round(((index + 1) / lesson.steps.length) * 100), [index, lesson.steps.length]);

  const handleComplete = useCallback(() => {
    if (!saved) {
      saveProgress(lesson.language, lesson.id);
      setSaved(true);
    }
  }, [lesson.language, lesson.id, saved]);

  if (!step) return null;

  return (
    <section className="grid grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-4 max-sm:grid-cols-1">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4">
        <p className="text-blue-600 font-black uppercase tracking-widest text-xs">{lesson.stageSlug.replaceAll("-", " ")}</p>
        <h1 className="text-4xl leading-none m-0">{lesson.title}</h1>
        <p className="text-slate-400 text-sm">{lesson.subtitle}</p>
        <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <StepContent step={step} />
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            disabled={index === 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-white text-slate-950 text-sm font-semibold border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >Back</button>
          {index === lesson.steps.length - 1 ? (
            <Link
              href={`/dashboard?language=${lesson.language}`}
              onClick={handleComplete}
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800"
            >
              {saved ? "Complete lesson" : "Complete lesson"}
            </Link>
          ) : (
            <button
              onClick={() => setIndex((value) => Math.min(lesson.steps.length - 1, value + 1))}
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 cursor-pointer"
            >Next</button>
          )}
        </div>
        {saved && (
          <p className="text-green-600 text-sm font-medium">Progress saved!</p>
        )}
      </div>

      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4">
        <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Lesson map</p>
        {lesson.steps.map((item, stepIndex) => (
          <button
            key={item.id}
            className={`w-full text-left border rounded-2xl p-4 cursor-pointer transition-colors text-sm ${
              stepIndex === index ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"
            }`}
            onClick={() => setIndex(stepIndex)}
          >
            {stepIndex + 1}. {item.title}
          </button>
        ))}
      </aside>
    </section>
  );
}
