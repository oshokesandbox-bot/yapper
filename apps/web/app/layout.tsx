import type { Metadata } from "next";
import "./globals.css";
import { TransitionWrapper } from "./transition-wrapper";

export const metadata: Metadata = {
  title: "Yapper",
  description: "Learn languages through guided immersion."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-slate-950 bg-slate-50">
        <TransitionWrapper>{children}</TransitionWrapper>
      </body>
    </html>
  );
}
