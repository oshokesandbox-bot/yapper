import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yapper Admin",
  description: "Content review and operations dashboard for Yapper."
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/content", label: "Content" },
  { href: "/ai", label: "AI Generation" },
  { href: "/review", label: "Review Queue" },
  { href: "/users", label: "Users" },
  { href: "/analytics", label: "Analytics" }
];

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ display: "flex", minHeight: "100vh" }}>
        <nav
          style={{
            width: 240,
            minHeight: "100vh",
            background: "#1e293b",
            borderRight: "1px solid #334155",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <p style={{ color: "#38bdf8", fontWeight: 700, fontSize: 16, margin: "0 0 4px" }}>Yapper Admin</p>
            <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>Content operations</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="sidebar-link"
                style={{
                  display: "block",
                  padding: "10px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "#94a3b8",
                  fontSize: 14,
                  fontWeight: 400
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid #334155" }}>
            <a
              href="/auth/login"
              className="sidebar-link"
              style={{
                display: "block",
                padding: "10px 14px",
                borderRadius: 10,
                textDecoration: "none",
                color: "#f87171",
                fontSize: 14
              }}
            >
              Log out
            </a>
          </div>
        </nav>

        <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
      </body>
    </html>
  );
}
