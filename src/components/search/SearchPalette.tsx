"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Laptop,
  Smartphone,
  Tv,
  Sparkles,
  TrendingUp,
  History,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Placeholder data for the prototype
const SUGGESTIONS = {
  trending: [
    {
      title: "iPhone 15 Pro vs Pixel 8 Pro",
      type: "compare",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      title: "Best laptops for programming",
      type: "decision",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      title: "Top TVs under $1000",
      type: "decision",
      icon: <Tv className="w-4 h-4" />,
    },
  ],
  recent: [
    {
      title: "MacBook Air M3",
      type: "device",
      icon: <History className="w-4 h-4" />,
    },
    {
      title: "Samsung Galaxy S24 Ultra",
      type: "device",
      icon: <History className="w-4 h-4" />,
    },
  ],
};

const DYNAMIC_PLACEHOLDERS = [
  "Search phones, laptops, TVs or ask AI…",
  "Compare iPhone 15 Pro vs Pixel 8 Pro…",
  "Find a laptop for programming under $1200…",
  "Best camera for video…",
];

export function SearchPalette() {
  const { isOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholders
  useEffect(() => {
    if (isOpen) return; // Freeze placeholder when open
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (current) => (current + 1) % DYNAMIC_PLACEHOLDERS.length,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow react to render before focusing
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Mock search results when typing
  const isTyping = query.length > 0;

  const handleSelect = (text: string) => {
    closeSearch();
    // Simulate navigation/search
    console.log("Selected:", text);
    router.push(`/search?q=${encodeURIComponent(text)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            onClick={closeSearch}
          />

          {/* Dialog Container to handle scroll if needed */}
          <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-20 flex justify-center items-start pt-[15vh]">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-2xl bg-surface/80 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-2xl overflow-hidden focus:outline-none ring-1 ring-border-subtle/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Input Header */}
              <div className="relative flex items-center px-4 py-4 border-b border-border-subtle/50 group focus-within:bg-surface transition-colors">
                <Search className="w-5 h-5 text-text-secondary mr-3 shrink-0" />
                <div className="relative flex-1 h-7 flex items-center">
                  <AnimatePresence mode="popLayout">
                    {query.length === 0 && (
                      <motion.div
                        key={placeholderIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center text-text-secondary/60 pointer-events-none sm:text-lg"
                      >
                        {DYNAMIC_PLACEHOLDERS[placeholderIndex]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-full bg-transparent border-none text-text-primary outline-none sm:text-lg font-medium"
                    placeholder=""
                  />
                </div>
                {query.length > 0 && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors mr-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="hidden sm:flex items-center justify-center shrink-0 h-6 px-1.5 rounded bg-surface border border-border-subtle text-[10px] text-text-secondary font-medium tracking-widest ml-2">
                  ESC
                </div>
              </div>

              {/* Body */}
              <div className="p-2 max-h-[60vh] overflow-y-auto overscroll-contain">
                {!isTyping ? (
                  <div className="py-2">
                    <div className="px-3 py-1.5 text-xs font-semibold text-text-secondary/80 uppercase tracking-widest">
                      Trending Comparisons
                    </div>
                    {SUGGESTIONS.trending.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(item.title)}
                        className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-surface-elevated text-left group transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface mr-3 text-text-secondary group-hover:bg-background group-hover:text-accent group-hover:shadow-sm transition-all">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-text-primary">
                          {item.title}
                        </span>
                      </button>
                    ))}

                    <div className="px-3 py-1.5 text-xs font-semibold text-text-secondary/80 uppercase tracking-widest mt-4">
                      Recent Decisions
                    </div>
                    {SUGGESTIONS.recent.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(item.title)}
                        className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-surface-elevated text-left group transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface mr-3 text-text-secondary group-hover:bg-background group-hover:text-accent group-hover:shadow-sm transition-all">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-text-primary">
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-2">
                    {/* Mock Search Results */}
                    <div className="px-3 py-1.5 text-xs font-semibold text-text-secondary/80 uppercase tracking-widest">
                      Jump To
                    </div>
                    <button
                      onClick={() => handleSelect(`Device: ${query}`)}
                      className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-surface-elevated text-left group transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface mr-3 text-text-secondary group-hover:bg-background group-hover:text-accent group-hover:shadow-sm transition-all">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">
                          Pixel 8 Pro
                        </span>
                        <span className="text-xs text-text-secondary">
                          Matches "{query}" • Phones
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        handleSelect(`Device: ${query} (Alternative)`)
                      }
                      className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-surface-elevated text-left group transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface mr-3 text-text-secondary group-hover:bg-background group-hover:text-accent group-hover:shadow-sm transition-all">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">
                          iPhone 15 Pro
                        </span>
                        <span className="text-xs text-text-secondary">
                          Related to "{query}" • Phones
                        </span>
                      </div>
                    </button>

                    <div className="px-3 py-1.5 text-xs font-semibold text-text-secondary/80 uppercase tracking-widest mt-4">
                      Compare With
                    </div>
                    <button
                      onClick={() =>
                        handleSelect(`Compare: ${query} vs iPhone 15 Pro`)
                      }
                      className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-surface-elevated text-left group transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface mr-3 text-text-secondary group-hover:bg-background group-hover:text-accent group-hover:shadow-sm transition-all">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-text-primary">
                        Compare "{query}" vs iPhone 15 Pro
                      </span>
                      <ArrowRight className="w-4 h-4 text-text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <div className="px-3 py-1.5 text-xs font-semibold text-text-secondary/80 uppercase tracking-widest mt-4">
                      Decision Paths
                    </div>
                    <button
                      onClick={() =>
                        handleSelect(`Decide: Best phones for ${query}`)
                      }
                      className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-surface-elevated text-left group transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface mr-3 text-brand group-hover:bg-brand/10 group-hover:text-brand transition-all">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-brand">
                        See best phones for "{query}"
                      </span>
                      <ArrowRight className="w-4 h-4 text-brand ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border-subtle/50 bg-surface/50 sm:flex hidden items-center justify-between text-xs text-text-secondary/70">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <kbd className="w-5 h-5 flex items-center justify-center rounded bg-surface border border-border-subtle font-sans text-xs">
                      ↑
                    </kbd>
                    <kbd className="w-5 h-5 flex items-center justify-center rounded bg-surface border border-border-subtle font-sans text-xs">
                      ↓
                    </kbd>
                    <span>to navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 h-5 flex items-center justify-center rounded bg-surface border border-border-subtle font-sans text-xs">
                      ↵
                    </kbd>
                    <span>to select</span>
                  </div>
                </div>
                <span>Tech Nest Search Architecture</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
