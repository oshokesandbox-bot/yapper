import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yapper Admin",
  description: "Content review and operations dashboard for Yapper."
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
