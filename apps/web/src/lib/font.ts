/**
 * Tech Nest — Font Configuration
 *
 * Uses the Geist font family from Vercel:
 * · Geist Sans  — Display + Body (mathematical precision, geometric friendliness)
 * · Geist Mono  — Specs, chipsets, data values (engineered feel)
 *
 * Loaded via the `geist` npm package for Next.js App Router.
 * CSS variables: --font-geist-sans, --font-geist-mono
 * These are injected at the <html> level via layout.tsx.
 */

// Re-export from geist package for convenience
export { GeistSans } from "geist/font/sans";
export { GeistMono } from "geist/font/mono";
