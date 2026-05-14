"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveTokens, saveUser } from "@yapper/shared";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message ?? "Login failed. Check your credentials.");
        return;
      }

      saveTokens(data.accessToken, data.refreshToken);
      saveUser(data.user);

      if (data.user.isAdmin) {
        router.push("/");
      } else {
        setError("This account does not have admin privileges.");
      }
    } catch {
      setError("Could not reach the server. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 40,
          border: "1px solid #334155",
          borderRadius: 24,
          background: "#1e293b"
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: "#38bdf8", fontWeight: 700, fontSize: 18, margin: "0 0 4px" }}>Yapper Admin</p>
          <h1 style={{ fontSize: 26, margin: "0 0 8px", color: "#e2e8f0" }}>Admin login</h1>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: 14 }}>
            Log in with your admin account to manage content.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid #f87171",
              background: "rgba(248,113,113,0.08)",
              color: "#f87171",
              marginBottom: 20,
              fontSize: 14
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 14, fontWeight: 500 }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@yapper.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#e2e8f0",
                fontSize: 15,
                outline: "none"
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 14, fontWeight: 500 }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#e2e8f0",
                fontSize: 15,
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              border: "none",
              background: loading ? "#475569" : "#38bdf8",
              color: loading ? "#94a3b8" : "#0f172a",
              fontWeight: 600,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 8
            }}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
