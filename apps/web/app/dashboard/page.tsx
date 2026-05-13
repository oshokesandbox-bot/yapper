import Link from "next/link";
import { Suspense } from "react";
import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 pb-16">
      <nav className="flex items-center justify-between gap-4 mb-10 max-sm:flex-col max-sm:items-start">
        <Link href="/" className="text-2xl font-black tracking-tighter">Yapper</Link>
        <div className="flex gap-4 text-sm text-slate-500">
          <Link href="/recommendations">Recommendations</Link>
          <Link href="/onboarding">Onboarding</Link>
          <Link href="/languages">Languages</Link>
        </div>
      </nav>
      <Suspense fallback={<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading dashboard&hellip;</section>}>
        <DashboardClient />
      </Suspense>
    </main>
  );
}
