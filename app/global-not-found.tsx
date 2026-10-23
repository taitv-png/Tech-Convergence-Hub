import type { Metadata } from "next";
// No shared stylesheet imports here: a different import order would reorder the global CSS
// chunks of the two root layouts. The page is styled inline.

export const metadata: Metadata = {
  title: "Page not found · Tech-Convergence Hub",
  robots: { index: false },
};

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// One charcoal 404 for both locales (each locale has its own root layout).
export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="dark" style={{ backgroundColor: "#121110", colorScheme: "dark" }}>
      <body style={{ margin: 0, background: "#121110", color: "#f3eee7", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: 960, margin: "0 auto", padding: "15vh 24px" }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.08em", color: "#b8b0a5" }}>404</p>
          <h1 style={{ margin: "16px 0 32px", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 500, lineHeight: 1.1 }}>
            Page not found.{" "}
            <span lang="vi" style={{ color: "#ff9a5f" }}>
              Không tìm thấy trang.
            </span>
          </h1>
          <p style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            <a href={base + "/"} style={{ background: "#d94d12", color: "#fff", padding: "14px 22px", textDecoration: "none" }}>
              Home
            </a>
            <a href={base + "/vi"} lang="vi" style={{ color: "#f3eee7" }}>
              Trang chủ tiếng Việt
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
