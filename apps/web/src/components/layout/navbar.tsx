"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`
          transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${
            scrolled
              ? "border-b bg-[var(--bg-primary)]/80 backdrop-blur-[12px] border-[var(--border)]"
              : "border-b border-transparent bg-transparent"
          }
        `}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex h-16 items-center justify-between">
            {/* LEFT — Logo + Nav */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-[16px] font-medium tracking-tight text-[var(--accent)] font-[family-name:var(--font-display)]"
              >
                Tech Nest
              </Link>

              <nav className="hidden items-center gap-6 md:flex">
                {[
                  { href: "/", label: "Home" },
                  { href: "/phones", label: "Phones" },
                  { href: "/compare", label: "Compare" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] leading-[20px] text-[var(--text-secondary)] transition-colors duration-[120ms] hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* CENTER — Search */}
            <div className="hidden flex-1 justify-center px-6 md:flex">
              <div className="w-full max-w-[400px]">
                <div className="relative rounded-[12px] bg-[var(--bg-secondary)] transition-all duration-[180ms] focus-within:shadow-[var(--accent-glow)]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-[var(--text-tertiary)]" />
                  </div>
                  <Input
                    placeholder="Search devices…"
                    className="h-9 w-full rounded-[12px] border-0 bg-transparent pl-9 text-[13px] placeholder:text-[var(--text-tertiary)] focus-visible:outline-none focus-visible:ring-0"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* RIGHT — Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Show when="signed-in">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)]">
                  <UserButton />
                </div>
              </Show>

              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-[13px] text-[var(--text-secondary)] transition-colors duration-[120ms] hover:text-[var(--text-primary)]">
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
