import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── shadcn/ui semantic color tokens ────────────────────── */
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent-hsl))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border-hsl))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /* ── "Dual-Soul" semantic tokens (CSS custom props) ── */
        tn: {
          bg:               "var(--bg-base)",
          "bg-secondary":   "var(--bg-secondary)",
          surface:          "var(--surface)",
          "surface-raised": "var(--surface-raised)",
          "text-primary":   "var(--text-primary)",
          "text-secondary": "var(--text-secondary)",
          "text-muted":     "var(--text-muted)",
          "text-inverse":   "var(--text-inverse)",
          border:           "var(--border)",
          "border-subtle":  "var(--border-subtle)",
          "border-strong":  "var(--border-strong)",
          accent:           "var(--accent)",
          "accent-hover":   "var(--accent-hover)",
          "accent-subtle":  "var(--accent-subtle)",
          "accent-muted":   "var(--accent-muted)",
          success:          "var(--success)",
          warning:          "var(--warning)",
          error:            "var(--error)",
        },
      },

      /* ── Geist Font Stack ──────────────────────────────────── */
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        body:    ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-geist-mono)", "monospace"],
        sans:    ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },

      /* ── Typography Scale ──────────────────────────────────── */
      fontSize: {
        "heading-1": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em" }],
        "heading-2": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "heading-3": ["20px", { lineHeight: "28px", letterSpacing: "-0.015em" }],
        "heading-4": ["16px", { lineHeight: "24px", letterSpacing: "-0.01em" }],
        body:        ["15px", { lineHeight: "24px" }],
        "body-lg":   ["17px", { lineHeight: "28px" }],
        "body-sm":   ["13px", { lineHeight: "20px" }],
      },

      /* ── Border radius ──────────────────────────────────── */
      borderRadius: {
        sm:    "4px",
        DEFAULT: "8px",
        md:    "8px",
        lg:    "12px",
        xl:    "16px",
        "2xl": "24px",
        "3xl": "32px",
        full:  "9999px",
      },

      /* ── Shadow system ────────────────────────────────────── */
      boxShadow: {
        sm:    "var(--shadow-sm)",
        md:    "var(--shadow-md)",
        lg:    "var(--shadow-lg)",
        xl:    "var(--shadow-xl)",
        card:  "var(--card-shadow)",
        accent: "var(--shadow-accent)",
      },

      /* ── Transitions (physics, not decoration) ──────────── */
      transitionTimingFunction: {
        default: "cubic-bezier(0.4, 0, 0.2, 1)",
        spring:  "cubic-bezier(0.16, 1, 0.3, 1)",
        bounce:  "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      transitionDuration: {
        fast:   "120ms",
        normal: "200ms",
        slow:   "350ms",
      },

      /* ── Animations ───────────────────────────────────────── */
      animation: {
        "fade-in":    "tn-fade-in  350ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in":   "tn-scale-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-up":   "tn-slide-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-down": "tn-slide-down 300ms cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer:      "tn-shimmer 1.8s ease-in-out infinite",
      },

      keyframes: {
        "tn-fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "tn-scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "tn-slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "tn-slide-down": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "tn-shimmer": {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },

      /* ── 8pt Rhythm Spacing ────────────────────────────────── */
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
      },

      /* ── Max widths ───────────────────────────────────────── */
      maxWidth: {
        content:    "960px",
        layout:     "1200px",
        prose:      "68ch",
        "prose-sm": "52ch",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
