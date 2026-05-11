import Link from "next/link";
import { getLessonById, seedLessons } from "@yapper/shared";
import { LessonPlayer } from "./lesson-player";

export function generateStaticParams() {
  return seedLessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10 pb-16">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4">
          <h1 className="text-2xl font-semibold">Lesson not found</h1>
          <Link href="/dashboard" className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 self-start">Back to dashboard</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 pb-16">
      <nav className="flex items-center justify-between gap-4 mb-10 max-sm:flex-col max-sm:items-start">
        <Link href="/" className="text-2xl font-black tracking-tighter">Yapper</Link>
        <div className="flex gap-4 text-sm text-slate-500">
          <Link href={`/dashboard?language=${lesson.language}`}>Dashboard</Link>
          <Link href="/languages">Languages</Link>
        </div>
      </nav>
      <LessonPlayer lesson={lesson} />
    </main>
  );
}
