"use client";

import { getAccessToken } from "@yapper/shared";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ReviewState = "all" | "pending" | "approved" | "rejected";

interface AiGenerationItem {
  id: string;
  language: string;
  kind: string;
  stageSlug: string;
  prompt: string;
  output: unknown;
  reviewState: string;
  createdAt: string;
  review?: {
    reviewNotes: string | null;
  } | null;
  contentReview?: {
    reviewNotes: string | null;
  } | null;
}

const kindLabels: Record<string, string> = {
  VOCABULARY_CARD: "Vocabulary Card",
  MICRO_STORY: "Micro Story",
  DIALOGUE: "Dialogue",
  MINIMAL_PAIR: "Minimal Pair",
  SENTENCE_PROMPT: "Sentence Prompt",
  COMPREHENSION_QUESTION: "Comprehension Question",
  COMPOSITION_PROMPT: "Composition Prompt"
};

const stageLabels: Record<string, string> = {
  immersion: "Immersion",
  "literacy-sounds": "Literacy & Sounds",
  "core-vocabulary": "Core Vocabulary",
  "sentence-production": "Sentence Production",
  "dictionary-reference": "Dictionary & Ref.",
  "grammar-figures": "Grammar & Figures",
  "comprehension-tests": "Comprehension Tests",
  "composition-tests": "Composition Tests"
};

const stateColors: Record<string, string> = {
  PENDING: "#fbbf24",
  APPROVED: "#86efac",
  REJECTED: "#f87171",
  EDITED: "#38bdf8"
};

export default function ReviewPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<ReviewState>("all");
  const [generations, setGenerations] = useState<AiGenerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchGenerations = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = getAccessToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const params = filter !== "all" ? `?state=${filter}` : "";
      const response = await fetch(`${apiUrl}/api/ai/generations${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error?.message ?? "Failed to fetch generations");
        setGenerations([]);
        return;
      }

      const data = await response.json();
      setGenerations(data.generations ?? []);
    } catch {
      setError("Could not reach the server.");
      setGenerations([]);
    } finally {
      setLoading(false);
    }
  }, [filter, router]);

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  async function handleReview(id: string, reviewState: string) {
    setActionLoading(id);

    const token = getAccessToken();
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/api/ai/generations/${id}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewState,
          reviewNotes: reviewNotes.trim() || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error?.message ?? "Review action failed");
        return;
      }

      setReviewNotes("");
      setExpandedId(null);
      await fetchGenerations();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setActionLoading(null);
    }
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function getKind(kind: string): string {
    return kindLabels[kind.toUpperCase()] ?? kind;
  }

  function getReviewNotes(item: AiGenerationItem): string | null {
    return item.contentReview?.reviewNotes ?? item.review?.reviewNotes ?? null;
  }

  const filters: { value: ReviewState; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ];

  return (
    <main style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 8px", color: "#e2e8f0" }}>Review Queue</h1>
      <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>
        Review and approve/reject AI-generated content before it enters the catalog.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border: filter === f.value ? "1px solid #38bdf8" : "1px solid #334155",
              background: filter === f.value ? "rgba(56,189,248,0.1)" : "transparent",
              color: filter === f.value ? "#38bdf8" : "#94a3b8",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: filter === f.value ? 600 : 400
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

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

      {loading && (
        <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
          Loading generations…
        </div>
      )}

      {!loading && generations.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
          <p style={{ fontSize: 18, margin: "0 0 8px" }}>No generations found</p>
          <p style={{ fontSize: 14, margin: 0 }}>
            {filter !== "all"
              ? `No ${filter} generations to review.`
              : "Generate content via the AI page to start reviewing."}
          </p>
        </div>
      )}

      {!loading && generations.map((item) => (
        <article
          key={item.id}
          style={{
            border: "1px solid #334155",
            borderRadius: 16,
            marginBottom: 12,
            overflow: "hidden"
          }}
        >
          <div
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            style={{
              padding: "16px 20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <strong style={{ color: "#e2e8f0", fontSize: 15 }}>{item.language}</strong>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>·</span>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>{getKind(item.kind)}</span>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>·</span>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>
                  {stageLabels[item.stageSlug] ?? item.stageSlug}
                </span>
              </div>
              {item.prompt && (
                <p style={{ color: "#64748b", fontSize: 13, margin: "6px 0 0" }}>
                  {(() => {
                    try {
                      const parsed = JSON.parse(item.prompt);
                      return parsed.topic || parsed.kind || "—";
                    } catch {
                      return item.prompt.slice(0, 80);
                    }
                  })()}
                </p>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#64748b", fontSize: 12 }}>
                {formatDate(item.createdAt)}
              </span>
              <span style={{
                padding: "3px 10px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 600,
                background: stateColors[item.reviewState] ?? "#475569",
                color: item.reviewState === "APPROVED" || item.reviewState === "EDITED" ? "#0f172a" : item.reviewState === "PENDING" ? "#0f172a" : "#0f172a"
              }}>
                {item.reviewState}
              </span>
              <span style={{ color: "#64748b", fontSize: 18 }}>
                {expandedId === item.id ? "▾" : "▸"}
              </span>
            </div>
          </div>

          {expandedId === item.id && (
            <div style={{
              borderTop: "1px solid #334155",
              padding: 20
            }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 8px", fontWeight: 600 }}>Generated Output</p>
                <pre style={{
                  background: "#1e293b",
                  padding: 16,
                  borderRadius: 12,
                  overflow: "auto",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#e2e8f0",
                  maxHeight: 400,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word"
                }}>
                  {JSON.stringify(item.output, null, 2)}
                </pre>
              </div>

              {getReviewNotes(item) && (
                <div style={{
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #334155",
                  marginBottom: 16,
                  background: "#1e293b"
                }}>
                  <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 4px", fontWeight: 600 }}>Previous Review Notes</p>
                  <p style={{ color: "#e2e8f0", fontSize: 14, margin: 0 }}>{getReviewNotes(item)}</p>
                </div>
              )}

              <textarea
                placeholder="Add review notes (optional)"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "#e2e8f0",
                  fontSize: 14,
                  resize: "vertical",
                  marginBottom: 12,
                  fontFamily: "inherit"
                }}
              />

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleReview(item.id, "approved")}
                  disabled={actionLoading === item.id}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: actionLoading === item.id ? "#475569" : "#86efac",
                    color: "#0f172a",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: actionLoading === item.id ? "not-allowed" : "pointer"
                  }}
                >
                  {actionLoading === item.id ? "Saving…" : "✓ Approve"}
                </button>
                <button
                  onClick={() => handleReview(item.id, "rejected")}
                  disabled={actionLoading === item.id}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: actionLoading === item.id ? "#475569" : "#f87171",
                    color: "#0f172a",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: actionLoading === item.id ? "not-allowed" : "pointer"
                  }}
                >
                  {actionLoading === item.id ? "Saving…" : "✕ Reject"}
                </button>
              </div>
            </div>
          )}
        </article>
      ))}
    </main>
  );
}
