"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Phones", href: "/phones" },
  { name: "Compare", href: "/compare" },
  { name: "News", href: "/news" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full tn-glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="tn-h4 text-tn-accent hover:text-tn-accent-hover transition-colors">
            Tech Nest
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="tn-body-sm font-medium text-tn-text-secondary hover:text-tn-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-xl px-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tn-text-muted" />
            <Input
              type="search"
              placeholder="Search phones, comparisons, news..."
              className="w-full pl-9 rounded-full bg-tn-surface border-tn-border focus-visible:ring-tn-accent h-9 shadow-sm"
              disabled
            />
          </div>
        </div>

        {/* Right Area */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          
          <div className="hidden md:block">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="default" size="sm" className="bg-tn-accent hover:bg-tn-accent-hover text-tn-text-inverse rounded-full">
                  Sign In
                </Button>
              </SignInButton>
            </Show>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-tn-text-secondary hover:text-tn-text-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-tn-border bg-tn-surface/95 backdrop-blur-md shadow-md">
          <div className="flex flex-col p-4 gap-4">
            <div className="relative w-full mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tn-text-muted" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-9 rounded-full bg-tn-bg-secondary border-tn-border h-10"
                disabled
              />
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 tn-body-sm font-medium text-tn-text-primary hover:bg-tn-bg-secondary rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between mt-4 px-4 pt-4 border-t border-tn-border-subtle">
              <span className="tn-body-sm text-tn-text-secondary font-medium">Theme</span>
              <ThemeToggle />
            </div>
            <div className="px-4 pb-2 mt-4">
              <Show when="signed-in">
                <div className="flex items-center justify-between w-full">
                  <span className="tn-body-sm text-tn-text-secondary font-medium">Account</span>
                  <UserButton />
                </div>
              </Show>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button className="w-full bg-tn-accent hover:bg-tn-accent-hover text-tn-text-inverse rounded-full">
                    Sign In
                  </Button>
                </SignInButton>
              </Show>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
