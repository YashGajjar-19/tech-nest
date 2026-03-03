"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { label: "Best phones 2026", group: "trending" },
  { label: "iPhone 16 Pro Max vs Galaxy S24 Ultra", group: "trending" },
  { label: "Best laptop for coding", group: "trending" },
  { label: "Ask AI: Budget smartphone under $400", group: "ai" },
];

const RECENT = ["Galaxy S25 Ultra", "MacBook Air M4", "iPad Pro 2025"];

interface MobileSearchProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSearch({ open, onClose }: MobileSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      // Delay to let animation settle before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    } else {
      setQuery("");
    }
  }, [open]);

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            "fixed inset-0 z-100 flex flex-col bg-bg-primary",
            "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          )}
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border-subtle shrink-0">
            <Search className="w-5 h-5 text-text-secondary shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(query)}
              placeholder="Search devices, or ask AI..."
              className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary/50 text-base font-medium outline-none"
            />
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-text-primary/5 active:bg-text-primary/10 transition-colors"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-6">
            {/* Recent searches */}
            {RECENT.length > 0 && !query && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary/60 mb-3 px-1">
                  Recent
                </p>
                <div className="space-y-1">
                  {RECENT.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSubmit(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl active:bg-text-primary/5 transition-colors text-left"
                    >
                      <Clock className="w-4 h-4 text-text-secondary/50 shrink-0" />
                      <span className="text-[15px] font-medium text-text-primary">
                        {item}
                      </span>
                      <ArrowRight className="w-4 h-4 text-text-secondary/30 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending suggestions */}
            {!query && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary/60 mb-3 px-1">
                  Trending
                </p>
                <div className="space-y-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleSubmit(s.label)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl active:bg-text-primary/5 transition-colors text-left"
                    >
                      <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-[15px] font-medium text-text-primary">
                        {s.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-text-secondary/30 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live query state */}
            {query && (
              <button
                onClick={() => handleSubmit(query)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-accent text-accent-foreground font-semibold active:bg-accent/90 transition-colors"
              >
                <Search className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left truncate">
                  Search "{query}"
                </span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
