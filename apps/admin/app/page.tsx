"use client";

import { getAccessToken } from "@yapper/shared";
import { languages, productStages, seedLessons, seedRecommendations } from "@yapper/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface DashboardStats {
  languages: number;
  stages: number;
  lessons: { total: number; published: number };
  users: number;
  pendingGenerations: number;
}

export default function AdminHome() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch {
        // API unavailable — fall back to seed data below
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const publishedLessons = seedLessons.filter((l) => l.status === "published");
  const seedOnlyLessons = seedLessons.filter((l) => l.status === "seed");

  const displayStats: DashboardStats = stats ?? {
    languages: Object.keys(languages).length,
    stages: productStages.length,
    lessons: { total: seedLessons.length, published: publishedLessons.length },
    users: 0,
    pendingGenerations: 0
  };

  const seedFallback = !stats;

  return (
    <main style={{ padding: 32, maxWidth: 1120, margin: "0 auto" }}>
      <p style={{ color: "#38bdf8", fontWeight: 700 }}>Yapper Admin</p>
      <h1 style={{ fontSize: 36, margin: "0 0 8px" }}>Content operations dashboard</h1>
      <p style={{ color: "#94a3b8", fontSize: 16 }}>
        {seedFallback
          ? "Showing seed data — API unavailable for real-time stats."
          : "Live stats from the API."}
      </p>

      {/* Stat cards */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 28 }}>
        <StatCard label="Languages" value={String(displayStats.languages)} fallback="configured" />
        <StatCard label="Product stages" value={String(displayStats.stages)} fallback="configured" />
        <StatCard
          label="Lessons"
          value={`${displayStats.lessons.published} published`}
          detail={`${displayStats.lessons.total} total`}
          fallback="seed only"
        />
        <StatCard
          label="Users"
          value={displayStats.users > 0 ? String(displayStats.users) : "—"}
          fallback="no DB"
        />
        <StatCard
          label="Pending AI reviews"
          value={displayStats.pendingGenerations > 0 ? String(displayStats.pendingGenerations) : "0"}
          fallback="no DB"
        />
      </section>

      {/* Quick links */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 20, margin: "0 0 16px" }}>Quick actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <QuickLink href="/ai" label="Generate AI Content" />
          <QuickLink href="/review" label="Review Queue" />
          <QuickLink href="/content" label="Browse Content" />
          <QuickLink href="/users" label="User Management" />
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <div style={{ marginTop: 36, padding: 24, border: "1px solid #334155", borderRadius: 16 }}>
          <p style={{ color: "#94a3b8" }}>Loading stats from API…</p>
        </div>
      )}

      {/* Seed lesson catalog */}
      {!loading && (
        <section style={{ marginTop: 36, display: "grid", gap: 12 }}>
          <h2 style={{ fontSize: 20, margin: 0 }}>Seed lesson catalog</h2>
          {seedLessons.map((lesson) => (
            <div
              key={lesson.id}
              style={{
                border: "1px solid #334155",
                borderRadius: 18,
                padding: 18,
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center"
              }}
            >
              <div>
                <strong>{lesson.title}</strong>
                <p style={{ color: "#94a3b8", margin: "6px 0 0", fontSize: 14 }}>
                  {lesson.language.toUpperCase()} · {lesson.stageSlug} · {lesson.steps.length} steps
                </p>
              </div>
              <span
                style={{
                  color: lesson.status === "published" ? "#86efac" : "#fbbf24",
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                {lesson.status}
              </span>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
  fallback
}: {
  label: string;
  value: string;
  detail?: string;
  fallback: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #334155",
        borderRadius: 16,
        padding: 20
      }}
    >
      <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 6px", fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#e2e8f0" }}>{value}</p>
      {detail && <p style={{ color: "#64748b", fontSize: 12, margin: "4px 0 0" }}>{detail}</p>}
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        padding: "10px 22px",
        borderRadius: 12,
        border: "1px solid #334155",
        background: "#1e293b",
        color: "#38bdf8",
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 500,
        display: "inline-block"
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = "#334155"; }}
      onMouseOut={(e) => { e.currentTarget.style.background = "#1e293b"; }}
    >
      {label} →
    </a>
  );
}
