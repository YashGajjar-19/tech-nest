/**
 * Tech Nest — Font Configuration
 *
 * Display:  Syne           — Geometric, confident, premium-minimal headings
 * Body:     Instrument Sans — Clean, refined, highly legible UI & copy
 * Mono:     JetBrains Mono  — Specs, chipsets, data values, code
 *
 * All loaded via next/font/google for zero-layout-shift and optimal performance.
 * CSS variables are injected at the <html> level via layout.tsx.
 */

import { Syne, Instrument_Sans, JetBrains_Mono } from "next/font/google";

export const fontDisplay = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const fontBody = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false, // Mono is non-critical path
});

/**
 * Combine all font variables into a single className string.
 * Usage: <html className={fontVariables}> in layout.tsx
 */
export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontMono.variable,
].join(" ");
