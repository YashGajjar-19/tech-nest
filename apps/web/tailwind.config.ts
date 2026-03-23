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
      // ── shadcn/ui semantic color tokens ──────────────────────
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card-hsl))",
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

        // ── Tech Nest brand tokens (CSS var → no hsl wrapper) ──
        tn: {
          // Backgrounds
          bg: "var(--tn-bg)",
          "bg-secondary": "var(--tn-bg-secondary)",
          surface: "var(--tn-surface)",
          "surface-raised": "var(--tn-surface-raised)",
          // Text
          "text-primary": "var(--tn-text-primary)",
          "text-secondary": "var(--tn-text-secondary)",
          "text-muted": "var(--tn-text-muted)",
          "text-inverse": "var(--tn-text-inverse)",
          // Borders
          border: "var(--tn-border)",
          "border-subtle": "var(--tn-border-subtle)",
          "border-strong": "var(--tn-border-strong)",
          // Accent
          accent: "var(--tn-accent)",
          "accent-hover": "var(--tn-accent-hover)",
          "accent-subtle": "var(--tn-accent-subtle)",
          "accent-muted": "var(--tn-accent-muted)",
          // Semantic
          success: "var(--tn-success)",
          warning: "var(--tn-warning)",
          error: "var(--tn-error)",
        },
      },

      // ── Font families ──────────────────────────────────────
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },

      // ── Typography Scale ────────────────────────────────────
      // H1: 40/48 · H2: 28/36 · H3: 20/28 · Body: 15/24 · Small: 13/20
      fontSize: {
        "heading-1": ["40px", { lineHeight: "48px", letterSpacing: "-0.025em" }],
        "heading-2": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "heading-3": ["20px", { lineHeight: "28px", letterSpacing: "-0.015em" }],
        "heading-4": ["16px", { lineHeight: "24px", letterSpacing: "-0.01em" }],
        body: ["15px", { lineHeight: "24px" }],
        "body-lg": ["17px", { lineHeight: "28px" }],
        "body-sm": ["13px", { lineHeight: "20px" }],
      },

      // ── Border radius ──────────────────────────────────────
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
      },

      // ── Shadows ────────────────────────────────────────────
      boxShadow: {
        sm: "var(--tn-shadow-sm)",
        md: "var(--tn-shadow-md)",
        lg: "var(--tn-shadow-lg)",
        xl: "var(--tn-shadow-xl)",
      },

      // ── Transitions (physics, not decoration) ──────────────
      transitionTimingFunction: {
        default: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {
        fast: "120ms",
        normal: "180ms",
        slow: "280ms",
      },

      // ── Animations ─────────────────────────────────────────
      animation: {
        "fade-in": "tn-fade-in 280ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "slide-up": "tn-slide-up 280ms cubic-bezier(0.4, 0, 0.2, 1) both",
        shimmer: "tn-shimmer 1.8s ease-in-out infinite",
      },

      keyframes: {
        "tn-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "tn-slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "tn-shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },

      // ── Spacing Scale: 4/8/12/16/24/32/48/64 ──────────────
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },

      // ── Max width ──────────────────────────────────────────
      // Max: 1200px, Content: 960px
      maxWidth: {
        content: "960px",
        layout: "1200px",
        prose: "68ch",
        "prose-sm": "52ch",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
