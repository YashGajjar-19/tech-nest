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
import Logo, { LogoIcon } from "@/components/ui/Logo";

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
                 <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} pathname={pathname} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

// ── Auth-aware user button (desktop) ────────────────────────────────────────
function NavUserButton() {
  const { user, role, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="hidden sm:flex w-9 h-9 shrink-0 rounded-full bg-text-primary/5 border border-border-subtle animate-pulse" />
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal("login")}
        className="hidden sm:flex w-9 h-9 shrink-0 rounded-full bg-text-primary/5 hover:bg-text-primary/10 transition duration-200 items-center justify-center border border-border-subtle outline-none"
        title="Sign In"
      >
        <User className="h-4 w-4 text-text-secondary" />
      </button>
    );
  }

  const initials = (user.user_metadata?.full_name as string | undefined)
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? user.email?.[0]?.toUpperCase() ?? "U";

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="relative hidden sm:block">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex w-9 h-9 shrink-0 rounded-full items-center justify-center border border-border-subtle bg-text-primary/5 hover:bg-text-primary/10 transition duration-200 overflow-hidden outline-none text-xs font-semibold text-text-primary"
        title={user.email ?? "Account"}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={initials} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-11 z-50 min-w-[200px] rounded-2xl border border-border-subtle bg-surface/95 backdrop-blur-xl shadow-xl p-1.5"
            >
              <div className="px-3 py-2 mb-1">
                <p className="text-xs font-medium text-text-primary truncate">
                  {user.user_metadata?.full_name ?? "Account"}
                </p>
                <p className="text-xs text-text-secondary truncate">{user.email}</p>
                {role && role !== "user" && (
                  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-text-primary/8 text-[10px] font-medium text-text-secondary uppercase tracking-wide">
                    <Shield className="h-2.5 w-2.5" />
                    {role.replace("_", " ")}
                  </span>
                )}
              </div>
              <div className="border-t border-border-subtle mb-1" />
              {role && role !== "user" && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors duration-150"
                >
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors duration-150"
              >
                <User className="h-4 w-4" />
                View Profile
              </Link>
              <button
                onClick={async () => { setMenuOpen(false); await signOut(); }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors duration-150"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Extracted Mobile Menu to keep structure clean
function MobileMenu({ isOpen, setIsOpen, pathname }: { isOpen: boolean, setIsOpen: (o: boolean) => void, pathname: string }) {
  const { user, signOut, role } = useAuth();

  const allLinks = [
    ...NAV_LINKS, 
    ...AUTH_NAV_LINKS,
  ];

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      {/* Visually hidden titles for screen readers to satisfy Dialog requirements */}
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
      <SheetDescription className="sr-only">Access site pages and settings directly from the mobile menu.</SheetDescription>

      <div className="flex items-center justify-between p-6 border-b border-border-subtle">
         <Logo 
           size={28} 
           withText 
           className="text-text-primary"
         />
         {/* Dialog handles the X button natively via shadcn, but we leave space */}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="flex flex-col gap-2">
          {allLinks.map((link, i) => {
            const isActive = pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
            const Icon = link.icon;
            const locked = (link as { requiresAuth?: boolean }).requiresAuth && !user;

            const content = (
              <div className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ease-calm group",
                isActive
                  ? "bg-text-primary text-bg-primary shadow-premium-md"
                  : "bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary hover:shadow-sm"
              )}>
                <div className="flex items-center gap-4">
                  <Icon className={cn("h-5 w-5", isActive ? "text-bg-primary/80" : "text-text-secondary group-hover:text-accent")} />
                  <span className="font-semibold">{link.label}</span>
                </div>
                <ChevronRight className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive ? "text-bg-primary/50" : "text-border-subtle group-hover:translate-x-1 group-hover:text-text-primary"
                )} />
              </div>
            );

            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (i * 0.05), ease: [0.16, 1, 0.3, 1] }}
                key={link.to}
              >
                {locked ? (
                  <button className="w-full text-left" onClick={() => { setIsOpen(false); openAuthModal("login"); }}>
                    {content}
                  </button>
                ) : (
                  <Link href={link.to}>{content}</Link>
                )}
              </motion.div>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-border-subtle bg-surface/50">
        {user ? (
          <Button
            onClick={async () => { setIsOpen(false); await signOut(); }}
            variant="outline"
            className="w-full h-12 rounded-xl font-semibold transition-all ease-calm group"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={() => { setIsOpen(false); openAuthModal("login"); }}
            className="w-full h-12 rounded-xl bg-accent hover:bg-brand/90 text-text-primary font-semibold transition-all ease-calm hover:shadow-premium-md group"
          >
            <User className="mr-2 h-5 w-5 transition-transform" />
            Sign In to Tech Nest
          </Button>
        )}
      </div>
    </div>
  );
}
  