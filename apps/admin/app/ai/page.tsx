"use client";

import { getAccessToken } from "@yapper/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const LANGUAGES = ["EN", "FR", "ES", "DE", "RU"] as const;
const STAGES = [
  "immersion",
  "literacy-sounds",
  "core-vocabulary",
  "sentence-production",
  "dictionary-reference",
  "grammar-figures",
  "comprehension-tests",
  "composition-tests"
] as const;
const CONTENT_KINDS = [
  "vocabulary_card",
  "micro_story",
  "dialogue",
  "sentence_prompt",
  "comprehension_question",
  "composition_prompt"
] as const;
const DIFFICULTIES = ["seed", "mvp", "stretch"] as const;

const kindLabels: Record<string, string> = {
  vocabulary_card: "Vocabulary Card",
  micro_story: "Micro Story",
  dialogue: "Dialogue",
  sentence_prompt: "Sentence Prompt",
  comprehension_question: "Comprehension Question",
  composition_prompt: "Composition Prompt"
};

const stageLabels: Record<string, string> = {
  immersion: "Immersion",
  "literacy-sounds": "Literacy & Sounds",
  "core-vocabulary": "Core Vocabulary",
  "sentence-production": "Sentence Production",
  "dictionary-reference": "Dictionary & Reference",
  "grammar-figures": "Grammar & Figures of Speech",
  "comprehension-tests": "Comprehension Tests",
  "composition-tests": "Composition Tests"
};

interface GenerationResult {
  id: string;
  language: string;
  kind: string;
  stage: string;
  output: unknown;
  reviewState: string;
  warnings?: string[];
}

export default function AiGenerationPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("EN");
  const [stage, setStage] = useState("immersion");
  const [kind, setKind] = useState("vocabulary_card");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("seed");
  const [targetVocab, setTargetVocab] = useState<string[]>([]);
  const [vocabInput, setVocabInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/auth/login");
    }
  }, [router]);

  function addVocab() {
    const trimmed = vocabInput.trim();
    if (trimmed && !targetVocab.includes(trimmed)) {
      setTargetVocab([...targetVocab, trimmed]);
      setVocabInput("");
    }
  }

  function removeVocab(term: string) {
    setTargetVocab(targetVocab.filter((v) => v !== term));
  }

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setResult(null);
    setSaved(false);

    const token = getAccessToken();
    if (!token) {
      setError("Not authenticated. Please log in.");
      setGenerating(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          language: language.toLowerCase(),
          stage,
          kind,
          topic: topic || undefined,
          difficulty,
          targetVocabulary: targetVocab.length > 0 ? targetVocab : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message ?? "Generation failed");
        return;
      }

      setResult(data.generation);
    } catch {
      setError("Could not reach the server. Is the API running?");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 8px", color: "#e2e8f0" }}>AI Content Generation</h1>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>
        Generate content for the Yapper learning catalog using AI.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#e2e8f0",
              fontSize: 15
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>Stage</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#e2e8f0",
              fontSize: 15
            }}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{stageLabels[s] ?? s}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>Content Kind</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#e2e8f0",
              fontSize: 15
            }}
          >
            {CONTENT_KINDS.map((k) => (
              <option key={k} value={k}>{kindLabels[k] ?? k}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#e2e8f0",
              fontSize: 15
            }}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>Topic (optional)</label>
        <input
          type="text"
          placeholder="e.g., ordering coffee, daily routines, travel phrases"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#1e293b",
            color: "#e2e8f0",
            fontSize: 15
          }}
        />
      </div>

      <div style={{ marginBottom: 32 }}>
        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>
          Target Vocabulary (optional)
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Type a term and press Add"
            value={vocabInput}
            onChange={(e) => setVocabInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVocab(); } }}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#e2e8f0",
              fontSize: 15
            }}
          />
          <button
            onClick={addVocab}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#38bdf8",
              cursor: "pointer",
              fontSize: 14
            }}
          >
            Add
          </button>
        </div>
        {targetVocab.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {targetVocab.map((term) => (
              <span
                key={term}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 20,
                  border: "1px solid #334155",
                  background: "#1e293b",
                  fontSize: 13
                }}
              >
                {term}
                <button
                  onClick={() => removeVocab(term)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: 0,
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating}
        style={{
          padding: "12px 32px",
          borderRadius: 12,
          border: "none",
          background: generating ? "#475569" : "#38bdf8",
          color: generating ? "#94a3b8" : "#0f172a",
          fontWeight: 600,
          fontSize: 15,
          cursor: generating ? "not-allowed" : "pointer",
          marginBottom: 32
        }}
      >
        {generating ? "Generating…" : "Generate Content"}
      </button>

      {error && (
        <div style={{
          padding: 14,
          borderRadius: 12,
          border: "1px solid #f87171",
          background: "rgba(248,113,113,0.08)",
          color: "#f87171",
          marginBottom: 24
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          border: "1px solid #334155",
          borderRadius: 16,
          overflow: "hidden"
        }}>
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <strong style={{ color: "#38bdf8", fontSize: 16 }}>
                {result.language.toUpperCase()} · {kindLabels[result.kind] ?? result.kind}
              </strong>
              <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: 13 }}>
                {stageLabels[result.stage] ?? result.stage} · ID: {result.id}
              </p>
            </div>
            <span style={{
              padding: "4px 12px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              background: "#fbbf24",
              color: "#0f172a"
            }}>
              PENDING
            </span>
          </div>

          <div style={{ padding: 20 }}>
            <pre style={{
              background: "#1e293b",
              padding: 16,
              borderRadius: 12,
              overflow: "auto",
              fontSize: 13,
              lineHeight: 1.5,
              color: "#e2e8f0",
              maxHeight: 500,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            }}>
              {JSON.stringify(result.output, null, 2)}
            </pre>
          </div>

          {result.warnings && result.warnings.length > 0 && (
            <div style={{
              padding: "12px 20px",
              borderTop: "1px solid #334155",
              background: "rgba(251,191,36,0.06)"
            }}>
              <p style={{ color: "#fbbf24", fontSize: 13, margin: 0 }}>
                ⚠ {result.warnings.join(" · ")}
              </p>
            </div>
          )}

          <div style={{
            padding: "12px 20px",
            borderTop: "1px solid #334155",
            display: "flex",
            gap: 12
          }}>
            <button
              onClick={() => setSaved(true)}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                background: "#86efac",
                color: "#0f172a",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              {saved ? "✓ Saved to Queue" : "Save to Review Queue"}
            </button>
            <a
              href="/review"
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "1px solid #334155",
                color: "#38bdf8",
                textDecoration: "none",
                fontSize: 14
              }}
            >
              Go to Review Queue →
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
