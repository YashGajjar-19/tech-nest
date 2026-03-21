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
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
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

        // ── Electric Blue full scale (theme-invariant) ─────────
        blue: {
          50: "#EBF5FF",
          100: "#C9E5FF",
          200: "#94CCFF",
          300: "#56B0FF",
          400: "#2197FF",
          500: "#0080FF",
          600: "#006ACC",
          700: "#0051A3",
          800: "#003A7A",
          900: "#002352",
        },
      },

      // ── Font families ──────────────────────────────────────
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        // Override Tailwind's `font-sans` to use our body font
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },

      // ── Extended font sizes ────────────────────────────────
      fontSize: {
        display: [
          "clamp(2.75rem, 6vw, 4.75rem)",
          { lineHeight: "1.04", letterSpacing: "-0.038em" },
        ],
        "heading-1": [
          "clamp(2rem, 3.5vw, 3.25rem)",
          { lineHeight: "1.1", letterSpacing: "-0.032em" },
        ],
        "heading-2": [
          "clamp(1.5rem, 2.5vw, 2.25rem)",
          { lineHeight: "1.2", letterSpacing: "-0.025em" },
        ],
        "heading-3": [
          "clamp(1.2rem, 2vw, 1.625rem)",
          { lineHeight: "1.28", letterSpacing: "-0.02em" },
        ],
        "heading-4": [
          "1.125rem",
          { lineHeight: "1.35", letterSpacing: "-0.015em" },
        ],
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
        sm: "0 1px 2px rgb(0 0 0 / 0.04)",
        md: "0 4px 12px rgb(0 0 0 / 0.06), 0 1px 3px rgb(0 0 0 / 0.04)",
        lg: "0 12px 32px rgb(0 0 0 / 0.08), 0 2px 6px rgb(0 0 0 / 0.04)",
        accent: "0 4px 24px rgb(0 128 255 / 0.22)",
      },

      // ── Transitions ────────────────────────────────────────
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "350ms",
      },

      // ── Animations ─────────────────────────────────────────
      animation: {
        "fade-in": "tn-fade-in  0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in": "tn-scale-in 0.2s  cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "tn-shimmer  1.8s  ease-in-out infinite",
      },

      keyframes: {
        "tn-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "tn-scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "tn-shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },

      // ── Spacing extras ─────────────────────────────────────
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },

      // ── Max width ──────────────────────────────────────────
      maxWidth: {
        "8xl": "88rem", // 1408px — wide content
        "9xl": "96rem", // 1536px — full-width
        prose: "68ch",
        "prose-sm": "52ch",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
