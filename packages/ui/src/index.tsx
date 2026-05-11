import type { ComponentProps, ReactNode } from "react";
import { clsx } from "clsx";

export function Button({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      className={clsx(
        "rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx("rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", className)}>{children}</section>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">{children}</span>;
}
