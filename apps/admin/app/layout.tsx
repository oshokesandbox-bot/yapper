import type { Metadata } from "next";
import "./globals.css";
import { TransitionWrapper } from "./transition-wrapper";

export const metadata: Metadata = {
  title: "Yapper Admin",
  description: "Content review and operations dashboard for Yapper."
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-slate-200 bg-slate-900">
        <TransitionWrapper>{children}</TransitionWrapper>
      </body>
    </html>
  );
}
