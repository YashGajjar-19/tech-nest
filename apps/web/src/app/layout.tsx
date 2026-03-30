import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar, Footer } from "@/components/layout";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

/* ── Font Stack ─────────────────────────────────────────────
   Geist Sans  — Display + Body (mathematical precision, geometric)
                  CSS var: --font-geist-sans
   Geist Mono  — Specs, data, engineered feel
                  CSS var: --font-geist-mono
   ────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Tech Nest — Compare, Decide, Upgrade",
  description:
    "Compare phones side-by-side, read curated tech news, and get AI-powered recommendations. Premium, calm, decision-focused.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        <body className="flex min-h-screen flex-col">
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
