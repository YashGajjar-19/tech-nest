import { Search } from "lucide-react";
import { useSearch } from "@/components/providers/SearchProvider";

export default function HeroSearch() {
  const { openSearch } = useSearch();

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 sm:mt-14 px-4 sm:px-0">
      <button
        onClick={openSearch}
        className="w-full relative flex items-center h-14 sm:h-16 rounded-2xl bg-surface border border-border-subtle px-4 sm:px-5 transition-all active:scale-[0.99] hover:bg-surface-elevated hover:border-text-primary/10 hover:ring-4 hover:ring-accent/5 group shadow-sm text-left"
      >
        <Search className="w-5 h-5 text-text-secondary mr-3 sm:mr-4 shrink-0" />
        <span className="flex-1 text-text-secondary/60 text-sm sm:text-base md:text-lg font-medium">
          Search phones, laptops, TVs or ask AI…
        </span>
        <div className="hidden sm:flex items-center justify-center h-8 px-2.5 rounded-lg bg-text-primary/5 border border-border-subtle text-xs text-text-secondary font-medium tracking-widest ml-3 shrink-0">
          ⌘K
        </div>
      </button>
    </div>
  );
}
