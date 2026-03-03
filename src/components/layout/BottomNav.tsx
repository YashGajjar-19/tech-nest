"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Search, Scale, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/components/providers/SearchProvider";

const TAB_LINKS = [
  { label: "Home", to: "/", icon: Compass },
  { label: "Compare", to: "/compare", icon: Scale },
  { label: "Profile", to: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { openSearch } = useSearch();

  return (
    <nav
      className={cn(
        // Only visible on mobile
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "bg-bg-primary/80 backdrop-blur-2xl border-t border-border-subtle",
        // Safe area inset for iPhone notch / home indicator
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <Link
          href={TAB_LINKS[0].to}
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 h-full rounded-xl transition-all active:scale-90",
            pathname === TAB_LINKS[0].to
              ? "text-text-primary"
              : "text-text-secondary",
          )}
        >
          <Compass className="w-5 h-5" />
          <span
            className={cn(
              "text-[10px] font-medium",
              pathname === "/" ? "opacity-100" : "opacity-60",
            )}
          >
            Home
          </span>
        </Link>

        {/* Search — Center action, prominent */}
        <button
          onClick={openSearch}
          className="flex flex-col items-center justify-center w-16 h-full text-text-secondary active:scale-90 transition-all"
        >
          <div className="w-12 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-lg mb-0.5">
            <Search className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-[10px] font-medium opacity-60">Search</span>
        </button>

        {/* Compare */}
        <Link
          href={TAB_LINKS[1].to}
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 h-full rounded-xl transition-all active:scale-90",
            pathname === "/compare"
              ? "text-text-primary"
              : "text-text-secondary",
          )}
        >
          <Scale className="w-5 h-5" />
          <span
            className={cn(
              "text-[10px] font-medium",
              pathname === "/compare" ? "opacity-100" : "opacity-60",
            )}
          >
            Compare
          </span>
        </Link>

        {/* Profile */}
        <Link
          href={TAB_LINKS[2].to}
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 h-full rounded-xl transition-all active:scale-90",
            pathname === "/profile"
              ? "text-text-primary"
              : "text-text-secondary",
          )}
        >
          <User className="w-5 h-5" />
          <span
            className={cn(
              "text-[10px] font-medium",
              pathname === "/profile" ? "opacity-100" : "opacity-60",
            )}
          >
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
