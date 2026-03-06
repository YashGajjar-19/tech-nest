"use client";

import { useState, useEffect } from "react";
import { Search, Command, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Handle global cmd+k
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary/80 backdrop-blur-xl flex justify-center items-start pt-[15vh]">
      <div className="w-full max-w-2xl bg-surface border border-border-subtle rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center px-4 py-4 border-b border-border-subtle group">
          <Search className="w-6 h-6 text-text-secondary mr-3" />
          <input
            autoFocus
            type="text"
            className="w-full bg-transparent border-none outline-none text-xl placeholder:text-text-secondary placeholder:font-light"
            placeholder="Search for devices, categories, or AI matches..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-text-secondary bg-bg-secondary px-2 py-1 rounded-md border border-border-subtle hover:text-text-primary"
          >
            ESC
          </button>
        </div>

        <div className="p-4 max-h-[50vh] overflow-y-auto">
          {query.length > 0 ? (
            <div className="space-y-4">
              <div className="uppercase text-xs font-semibold text-text-secondary tracking-wider mb-2">
                Devices
              </div>
              <button
                className="w-full flex items-center justify-between p-3 hover:bg-bg-secondary rounded-xl transition group text-left"
                onClick={() => {
                  setOpen(false);
                  router.push("/device/iphone-16-pro");
                }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-surface border border-border-subtle rounded flex items-center justify-center mr-4">
                    📱
                  </div>
                  <div>
                    <div className="font-medium text-text-primary group-hover:text-amber-500 transition-colors">
                      iPhone 16 Pro
                    </div>
                    <div className="text-xs text-text-secondary">
                      Apple · Released 2024
                    </div>
                  </div>
                </div>
                <div className="text-xs text-text-secondary">Device Hub</div>
              </button>

              <div className="uppercase text-xs font-semibold text-text-secondary tracking-wider mt-6 mb-2">
                AI Suggestions
              </div>
              <button
                className="w-full flex items-center p-3 hover:bg-bg-secondary rounded-xl transition text-left"
                onClick={() => {
                  setOpen(false);
                  router.push("/decision");
                }}
              >
                <Command className="w-5 h-5 text-accent mr-4" />
                <div>
                  <div className="font-medium">
                    "Best phone for photography under $1000?"
                  </div>
                  <div className="text-xs text-text-secondary">
                    Ask the Decision AI
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-text-secondary">
              <Command className="w-10 h-10 mb-4 opacity-20" />
              <p className="text-sm">
                Start typing to search our entire database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
