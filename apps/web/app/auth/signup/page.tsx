"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveTokens, saveUser } from "@yapper/shared";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://yapper-mc7e.onrender.com";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName: displayName || undefined })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message ?? "Signup failed");
        return;
      }

      saveTokens(data.accessToken, data.refreshToken);
      saveUser(data.user);
      router.push("/onboarding");
    } catch {
      setError("Could not reach the server. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <nav className="nav">
        <Link className="logo" href="/">Yapper</Link>
        <div className="navLinks">
          <Link href="/languages">Languages</Link>
          <Link href="/auth/login">Log in</Link>
        </div>
      </nav>
      <section className="stack" style={{ maxWidth: 400, marginTop: 80 }}>
        <h1>Create your account</h1>
        <p className="muted">Start your immersion journey.</p>
        {error && <p className="errorMessage">{error}</p>}
        <form onSubmit={handleSubmit} className="stack" style={{ gap: 16, marginTop: 24 }}>
          <input
            className="input"
            type="text"
            placeholder="Display name (optional)"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16 }}>
          Already have an account? <Link href="/auth/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
