"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ──────────────────────────────────────────────────────────────
   THEME TOGGLE
   Dark ↔ Light with "Circular Expand" mask animation.
   The toggle icon bounces subtly (2px) on hover — "living software."
   Icon stroke-width: 1.25px (Lineal Precision).
   ────────────────────────────────────────────────────────────── */

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const toggleTheme = useCallback(() => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    // Try to use the View Transition API for the circular expand effect
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      buttonRef.current
    ) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Set the origin point for the circular clip-path
      document.documentElement.style.setProperty("--toggle-x", `${x}px`);
      document.documentElement.style.setProperty("--toggle-y", `${y}px`);

      document.startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }
  }, [resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="group relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[var(--accent-subtle)]"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Moon
              className="h-[16px] w-[16px] text-[var(--text-secondary)] transition-colors duration-200 group-hover:text-[var(--accent)]"
              strokeWidth={1.25}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sun
              className="h-[16px] w-[16px] text-[var(--text-secondary)] transition-colors duration-200 group-hover:text-[var(--accent)]"
              strokeWidth={1.25}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
