import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yapper",
  description: "Learn languages through guided immersion."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
