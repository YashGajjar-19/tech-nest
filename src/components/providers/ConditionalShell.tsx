"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileSearchWrapper } from "@/components/layout/MobileSearchWrapper";

/**
 * Renders public chrome (Navbar, Footer, BottomNav) everywhere EXCEPT
 * the /admin route tree, which has its own self-contained shell.
 */
export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin pages manage their own layout — just pass children through.
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <MobileSearchWrapper />
      <main className="flex-1 flex flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
