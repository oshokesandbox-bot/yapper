import Link from "next/link";
import { Suspense } from "react";
import { OnboardingFlow } from "./onboarding-flow";

export default function OnboardingPage() {
  return (
    <main className="page">
      <nav className="nav">
        <Link className="logo" href="/">Yapper</Link>
        <div className="navLinks"><Link href="/languages">Languages</Link><Link href="/dashboard">Dashboard</Link></div>
      </nav>
      <Suspense fallback={<section className="card">Loading onboarding…</section>}>
        <OnboardingFlow />
      </Suspense>
    </main>
  );
}
