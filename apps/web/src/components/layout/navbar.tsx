"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Command } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ──────────────────────────────────────────────────────────────
   NAVBAR
   Glassmorphism navigation (backdrop-blur: 20px)
   Center Column layout (max-width: 1200px)
   Lucide icons at stroke-width: 1.25
   ────────────────────────────────────────────────────────────── */

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/phones", label: "Phones" },
  { href: "/compare", label: "Compare" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-6 z-50 w-full px-6 flex justify-center">
      <div
        className={`tn-navbar rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}
      >
        <div className="w-full max-w-[1000px] px-6">
          <div className="flex h-[56px] items-center justify-between gap-12">
            {/* ── LEFT: Logo + Nav ── */}
            <div className="flex items-center gap-12">
              <Link
                href="/"
                className="flex items-center gap-2 text-[15px] font-light tracking-[-0.02em] text-(--text-primary) font-(family-name:--font-geist-sans)"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--accent)">
                  <span className="text-[12px] font-medium text-white">TN</span>
                </div>
                Tech Nest
              </Link>

              <nav className="hidden items-center gap-12 md:flex">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                      <Link
                      key={link.href}
                      href={link.href}
                      className={`
                        group/nav relative px-4 py-2 text-[10px] uppercase tracking-[2px] font-(family-name:--font-geist-sans)
                        transition-colors duration-300
                        ${
                          isActive
                            ? "text-(--text-primary)"
                            : "text-(--text-secondary) hover:text-(--text-primary)"
                        }
                      `}
                    >
                      {/* Left Construction Line */}
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-[10px] bg-[var(--text-primary)] opacity-0 group-hover/nav:opacity-30 transition-opacity duration-300" />
                      
                      <span className="relative z-10">{link.label}</span>
                      
                      {/* Right Construction Line */}
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[10px] bg-[var(--text-primary)] opacity-0 group-hover/nav:opacity-30 transition-opacity duration-300" />
                      
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute bottom-0 left-1/2 w-4 h-[1px] -translate-x-1/2 bg-[var(--accent)] pointer-events-none"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* ── CENTER: Search ── */}
            <div className="hidden flex-1 justify-center px-8 md:flex">
              <div className="w-full max-w-[380px]">
                <div className="group relative flex items-center rounded-xl bg-(--bg-secondary) transition-all duration-200 focus-within:shadow-(--focus-ring)">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search
                      className="h-[14px] w-[14px] text-(--text-muted) transition-colors duration-150 group-focus-within:text-(--text-secondary)"
                      strokeWidth={1.25}
                    />
                  </div>
                  <input
                    placeholder="Search devices…"
                    className="h-8 w-full rounded-xl border-0 bg-transparent pl-8 pr-12 text-[13px] text-(--text-primary) placeholder:text-(--text-muted) focus-visible:outline-none"
                    disabled
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <kbd className="flex h-5 items-center gap-0.5 rounded-md border border-(--border) bg-(--surface) px-1.5 text-[10px] font-medium text-(--text-muted) font-(family-name:--font-geist-mono)">
                      <Command className="h-[10px] w-[10px]" strokeWidth={1.25} />
                      K
                    </kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Actions ── */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Show when="signed-in">
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-(--border)">
                  <UserButton />
                </div>
              </Show>

              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="flex h-8 items-center rounded-lg px-3 text-[13px] font-medium text-(--text-secondary) transition-colors duration-150 hover:text-(--text-primary) hover:bg-(--accent-subtle)">
                    Sign In
                  </button>
                </SignInButton>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
