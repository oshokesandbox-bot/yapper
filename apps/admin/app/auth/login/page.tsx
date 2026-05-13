"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveTokens, saveUser } from "@yapper/shared";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://yapper-mc7e.onrender.com";

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
        setError(data.error?.message ?? "Login failed");
        return;
      }

      saveTokens(data.accessToken, data.refreshToken);
      saveUser(data.user);

      if (data.user.isAdmin) {
        router.push("/");
      } else {
        router.push("https://yapper-web-omega.vercel.app/dashboard");
      }
    } catch {
      setError("Could not reach the server. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <nav className="nav">
        <span className="logo">Yapper Admin</span>
      </nav>
      <section className="stack" style={{ maxWidth: 400, margin: "80px auto" }}>
        <h1>Admin login</h1>
        <p className="muted">Log in with your admin account.</p>
        {error && <p className="errorMessage">{error}</p>}
        <form onSubmit={handleSubmit} className="stack" style={{ gap: 16, marginTop: 24 }}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16 }}>
          <Link href="https://yapper-web-omega.vercel.app/auth/signup">Create account</Link>
        </p>
      </section>
    </main>
  );
}
