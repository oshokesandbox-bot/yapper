import Link from "next/link";
import { Suspense } from "react";
import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  return (
    <main className="page">
      <nav className="nav">
        <Link className="logo" href="/">Yapper</Link>
        <div className="navLinks"><Link href="/onboarding">Onboarding</Link><Link href="/languages">Languages</Link></div>
      </nav>
      <Suspense fallback={<section className="card">Loading dashboard…</section>}>
        <DashboardClient />
      </Suspense>
    </main>
  );
}
