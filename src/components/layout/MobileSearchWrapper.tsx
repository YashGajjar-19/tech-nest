"use client";

import { MobileSearch } from "@/components/layout/MobileSearch";
import { useSearch } from "@/components/providers/SearchProvider";

// Thin client wrapper so MobileSearch can live inside the SearchProvider
// without requiring the root layout to be a client component.
export function MobileSearchWrapper() {
  const { isOpen, closeSearch } = useSearch();
  return <MobileSearch open={isOpen} onClose={closeSearch} />;
}
