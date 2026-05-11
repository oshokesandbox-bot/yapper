"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Lesson, LessonStep } from "@yapper/shared";

function StepContent({ step }: { step: LessonStep }) {
  if (step.type === "immersion") {
    return (
      <div className="lessonStep">
        <p className="kicker">Immersion</p>
        <h2>{step.title}</h2>
        <p className="muted">{step.instruction}</p>
        <section className="card" style={{ background: "#f8fafc" }}>
          <h3>{step.mediaTitle}</h3>
          <p>Watch target: {step.mediaType}</p>
          {step.watchUrl ? <a className="button" href={step.watchUrl} target="_blank" rel="noreferrer">Open suggested search</a> : null}
        </section>
        <ul>{step.focus.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    );
  }

  if (step.type === "vocabulary") {
    return (
      <div className="lessonStep">
        <p className="kicker">Vocabulary</p>
        <h2>{step.title}</h2>
        <div className="vocabGrid">
          {step.cards.map((card) => (
            <section className="vocabCard" key={card.term}>
              <h3 style={{ fontSize: 28, margin: 0 }}>{card.term}</h3>
              <p><strong>{card.translation}</strong></p>
              <p className="muted">{card.concept} · {card.pronunciationHint}</p>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (step.type === "story") {
    return (
      <div className="lessonStep">
        <p className="kicker">Simple reader</p>
        <h2>{step.title}</h2>
        <p className="storyText">{step.text}</p>
        <div className="row">{step.glossary.map((item) => <span className="badge" key={item.term}>{item.term}: {item.translation}</span>)}</div>
      </div>
    );
  }

  return <QuizStep step={step} />;
}

function QuizStep({ step }: { step: Extract<LessonStep, { type: "quiz" }> }) {
  const [selected, setSelected] = useState<string | null>(null);
  const isCorrect = selected === step.answer;

  return (
    <div className="lessonStep">
      <p className="kicker">Check understanding</p>
      <h2>{step.title}</h2>
      <p>{step.prompt}</p>
      <div className="stack">
        {step.options.map((option) => (
          <button className={`option ${selected === option ? "selected" : ""}`} key={option} onClick={() => setSelected(option)}>{option}</button>
        ))}
      </div>
      {selected ? <section className="card" style={{ background: isCorrect ? "#ecfdf5" : "#fff7ed" }}><strong>{isCorrect ? "Good inference." : "Not quite — try the context again."}</strong><p>{step.explanation}</p></section> : null}
    </div>
  );
}

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [index, setIndex] = useState(0);
  const step = lesson.steps[index] ?? lesson.steps[0];
  const progress = useMemo(() => Math.round(((index + 1) / lesson.steps.length) * 100), [index, lesson.steps.length]);

  if (!step) return null;

  return (
    <section className="twoGrid">
      <div className="card stack">
        <p className="kicker">{lesson.stageSlug.replaceAll("-", " ")}</p>
        <h1 style={{ fontSize: 44, lineHeight: 1, margin: 0 }}>{lesson.title}</h1>
        <p className="muted">{lesson.subtitle}</p>
        <div className="progressTrack"><div className="progressFill" style={{ width: `${progress}%` }} /></div>
        <StepContent step={step} />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <button className="button secondary" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>Back</button>
          {index === lesson.steps.length - 1 ? (
            <Link className="button" href={`/dashboard?language=${lesson.language}`}>Complete lesson</Link>
          ) : (
            <button className="button" onClick={() => setIndex((value) => Math.min(lesson.steps.length - 1, value + 1))}>Next</button>
          )}
        </div>
      </div>

      <aside className="card stack">
        <p className="kicker">Lesson map</p>
        {lesson.steps.map((item, stepIndex) => (
          <button className={`option ${stepIndex === index ? "selected" : ""}`} key={item.id} onClick={() => setIndex(stepIndex)}>
            {stepIndex + 1}. {item.title}
          </button>
        ))}
      </aside>
    </section>
  );
}
