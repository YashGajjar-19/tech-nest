"use client";

import * as React from "react";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroSearchProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function HeroSearch({
  onSearch,
  placeholder = "Search devices, comparisons, or ask a question...",
  className,
  ...props
}: HeroSearchProps) {
  const [query, setQuery] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)} {...props}>
      <form
        onSubmit={handleSubmit}
        className="relative group flex items-center"
      >
        {/* Glow effect behind input */}
        <div className="absolute -inset-1 bg-linear-to-r from-accent/0 via-accent/20 to-accent/0 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />

        <div className="relative flex w-full items-center bg-surface border-2 border-border-subtle rounded-2xl overflow-hidden shadow-lg transition focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
          <div className="pl-6 pr-2 py-4">
            <Search className="w-6 h-6 text-text-secondary group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none py-5 text-lg font-medium text-text-primary placeholder:text-text-secondary/60 placeholder:font-normal"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="pr-4 pl-2 font-mono flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-text-primary text-bg-primary font-semibold text-sm rounded-xl hover:bg-text-primary/90 transition-transform active:scale-95 flex items-center gap-2 opacity-0 -translate-x-4 pointer-events-none group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:pointer-events-auto shadow-md"
            >
              Ask Tech Nest
              <Sparkles className="w-4 h-4 text-bg-secondary" />
            </button>
            <kbd className="hidden sm:inline-flex h-7 items-center gap-1 rounded border border-border-subtle bg-bg-secondary px-2 text-[11px] font-medium opacity-100 group-focus-within:hidden">
              <span className="text-xs">Ctrl</span> K
            </kbd>
          </div>
        </div>
      </form>
    </div>
  );
}
