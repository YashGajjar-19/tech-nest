"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Shield } from "lucide-react";
import { useAuth, openAuthModal } from "@/components/providers/AuthProvider";
import Image from "next/image";

export function NavUserButton() {
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
        className="flex w-9 h-9 shrink-0 rounded-full items-center justify-center border border-border-subtle bg-text-primary/5 hover:bg-text-primary/10 transition duration-200 overflow-hidden outline-none text-xs font-semibold text-text-primary relative"
        title={user.email ?? "Account"}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={initials} fill className="object-cover" />
        ) : (
          initials
        )}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <>
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
