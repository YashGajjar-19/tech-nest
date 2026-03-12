"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, Search, User, GitCompare, LayoutDashboard, ChevronRight, LogOut, Shield, Zap, Activity } from "lucide-react";
import { useAuth, openAuthModal } from "@/components/providers/AuthProvider";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";  
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Logo from "@/components/ui/Logo";
import { NavUserButton } from "./nav/NavUserButton";
import { MobileMenu } from "./nav/MobileMenu";

// Public nav links — shown to all users
const NAV_LINKS = [
  { label: "Discover", to: "/phones", icon: Search },
  { label: "Compare", to: "/compare", icon: GitCompare },
  { label: "Decision AI", to: "/decision", icon: Zap },
  { label: "Trending", to: "/#trending", icon: Activity },
];

// Auth-required nav links — shown in mobile menu with sign-in gate
const AUTH_NAV_LINKS = [
  { label: "Portfolio", to: "/portfolio", icon: LayoutDashboard, requiresAuth: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    return scrollY.on("change", (latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  // Close sheet on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Spacer to prevent layout shift because nav is fixed */}
      
      <header
        className={cn(
          "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none",
          isScrolled ? "top-4 w-[95%] max-w-5xl" : "top-6 w-fit"
        )}
      >
        <div 
          className={cn(
            "flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-full pointer-events-auto",
            isScrolled 
              ? "px-5 py-2.5 gap-4 rounded-xl bg-bg-primary/60 backdrop-blur-2xl border border-border-subtle shadow-xl" 
              : "px-6 py-3 gap-8 rounded-2xl bg-transparent border border-transparent"
          )}
        >
          
          {/* Logo Area */}
          <Link href="/" className="relative z-50 group outline-none">
            <div className={cn(
              "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left",
              isScrolled ? "scale-95 opacity-90" : "scale-100 opacity-100"
            )}>
              <Logo 
                size={32} 
                withText 
                className="text-text-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" 
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={cn(
            "hidden md:flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-text-primary/70",
            isScrolled ? "gap-5 text-sm" : "gap-7 text-[15px]"
          )}>
            {[
              ...NAV_LINKS,
            ].map((link) => {
              const isActive = pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  className={cn(
                    "relative hover:text-text-secondary transition-colors duration-200 outline-none group",
                    isActive ? "text-text-primary font-medium" : ""
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                  </span>
                  {isActive && (
                     <div className="absolute -bottom-1 left-0 h-[2px] w-full bg-blue-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 relative z-50">
            {/* Desktop Minimal Search Button / Appears on Scroll */}
            <button 
              onClick={() => window.dispatchEvent(new Event('open-search'))} 
              className={cn(
                "hidden sm:flex group items-center justify-between h-9 rounded-xl bg-text-primary/5 hover:bg-text-primary/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none overflow-hidden",
                isScrolled ? "w-56 px-3 border border-border-subtle opacity-100" : "w-0 px-0 border border-transparent opacity-0 pointer-events-none"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="h-4 w-4 text-text-secondary group-hover:text-text-primary transition-colors duration-200 shrink-0" />
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors duration-200 whitespace-nowrap">Search...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center rounded bg-text-primary/10 px-1 font-mono text-[10px] font-medium text-text-secondary shrink-0 ml-2">
                ⌘ + K
              </kbd>
            </button>

            {/* Mobile Search Icon */}
            <button className="sm:hidden w-9 h-9 rounded-full bg-text-primary/5 hover:bg-text-primary/10 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center shrink-0 border border-transparent outline-none" onClick={() => window.dispatchEvent(new Event('open-search'))}>
              <Search className="h-4 w-4 text-text-secondary" />
            </button>

            <div className={cn(
              "w-px h-5 bg-border-subtle hidden sm:block mx-1 transition-all duration-500",
              isScrolled ? "opacity-100" : "opacity-0"
            )} />

            <div className="hidden sm:flex transition-opacity hover:opacity-80 duration-300">
                <ThemeToggle />
            </div>

            <NavUserButton />

            {/* Mobile Nav Sheet Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden w-9 h-9 rounded-full bg-text-primary/5 hover:bg-text-primary/10 transition flex items-center justify-center shrink-0 border border-transparent outline-none">
                  <Menu className="h-5 w-5 text-text-secondary" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l-border-color bg-bg-primary/95 backdrop-blur-xl">
                 <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} pathname={pathname} navLinks={NAV_LINKS} authLinks={AUTH_NAV_LINKS} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}