"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, LogOut, User } from "lucide-react";
import { useAuth, openAuthModal } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

export function MobileMenu({ 
  isOpen, 
  setIsOpen, 
  pathname, 
  navLinks, 
  authLinks 
}: { 
  isOpen: boolean; 
  setIsOpen: (o: boolean) => void; 
  pathname: string;
  navLinks: any[];
  authLinks: any[];
}) {
  const { user, signOut } = useAuth();
  const allLinks = [...navLinks, ...authLinks];

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
      <SheetDescription className="sr-only">Access site pages and settings directly from the mobile menu.</SheetDescription>

      <div className="flex items-center justify-between p-6 border-b border-border-subtle">
         <Logo size={28} withText className="text-text-primary" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="flex flex-col gap-2">
          {allLinks.map((link, i) => {
            const isActive = pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
            const Icon = link.icon;
            const locked = link.requiresAuth && !user;

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
