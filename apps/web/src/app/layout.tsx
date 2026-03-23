import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar, Footer } from "@/components/layout";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* ── Font Stack ─────────────────────────────────────────────── */
/* Headings: Plus Jakarta Sans (geometric, confident — Satoshi alternative)  */
/* Body:     Inter (clean, refined)                                          */
/* Mono:     JetBrains Mono (specs, data)                                    */

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
        className={`${jakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning
      >
        <body className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
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
