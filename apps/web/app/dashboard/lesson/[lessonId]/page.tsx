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
      <main className="page">
        <section className="card"><h1>Lesson not found</h1><Link className="button" href="/dashboard">Back to dashboard</Link></section>
      </main>
    );
  }

  return (
    <main className="page">
      <nav className="nav">
        <Link className="logo" href="/">Yapper</Link>
        <div className="navLinks"><Link href={`/dashboard?language=${lesson.language}`}>Dashboard</Link><Link href="/languages">Languages</Link></div>
      </nav>
      <LessonPlayer lesson={lesson} />
    </main>
  );
}
