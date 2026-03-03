"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useWizard } from "./WizardContext";
import { getBrandsAction, createBrandAction } from "@/app/admin/devices/actions";
import type { Brand } from "@/types/wizard";
import { Search, Plus, Check, Loader2, ChevronRight, Building2 } from "lucide-react";

export function StepBrand() {
  const { setBrand, nextStep, markStepComplete, brandId } = useWizard();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createName, setCreateName] = useState("");
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Load brands
  useEffect(() => {
    setIsLoading(true);
    getBrandsAction().then((result) => {
      if (result.success && result.data) {
        setBrands(result.data);
        // If wizard already has a brand, pre-select it
        if (brandId) {
          const existing = result.data.find((b) => b.id === brandId);
          if (existing) setSelected(existing);
        }
      }
      setIsLoading(false);
    });
  }, [brandId]);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (brand: Brand) => {
    setSelected(brand);
    setBrand(brand.id, brand.name);
    setQuery("");
  };

  const handleCreateBrand = async () => {
    if (!createName.trim()) return;
    setIsSubmittingNew(true);
    setError(null);
    const result = await createBrandAction(createName.trim());
    if (result.success && result.data) {
      setBrands((prev) => [...prev, result.data!].sort((a, b) => a.name.localeCompare(b.name)));
      handleSelect(result.data);
      setIsCreating(false);
      setCreateName("");
    } else {
      setError(result.error ?? "Failed to create brand");
    }
    setIsSubmittingNew(false);
  };

  const handleContinue = () => {
    if (!selected) return;
    markStepComplete(1);
    nextStep();
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Step 1 of 7
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100 tracking-tight">
          Select Brand
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Which company makes this device?
        </p>
      </div>

      {/* Search box */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brands…"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/50 transition-all"
        />
      </div>

      {/* Brand list */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
          </div>
        ) : filtered.length === 0 && query ? (
          <div className="text-center py-10 text-sm text-zinc-600">
            No brands match &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((brand) => {
              const isSelected = selected?.id === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => handleSelect(brand)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150 text-left group",
                    isSelected
                      ? "border-zinc-400/50 bg-zinc-800/80 text-zinc-100"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900"
                  )}
                >
                  <span className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold uppercase text-zinc-400 group-hover:text-zinc-200 shrink-0">
                    {brand.name.slice(0, 2)}
                  </span>
                  <span className="truncate flex-1">{brand.name}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Create brand inline */}
      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create new brand
        </button>
      ) : (
        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/50 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-300">New Brand</span>
          </div>
          <input
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateBrand()}
            placeholder="Brand name (e.g. Samsung)"
            autoFocus
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/40 transition-all"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleCreateBrand}
              disabled={!createName.trim() || isSubmittingNew}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-900 rounded-lg text-xs font-semibold hover:bg-white transition-colors disabled:opacity-40"
            >
              {isSubmittingNew && <Loader2 className="w-3 h-3 animate-spin" />}
              Create Brand
            </button>
            <button
              onClick={() => { setIsCreating(false); setCreateName(""); setError(null); }}
              className="px-3 py-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Continue */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-zinc-600">
          {selected ? (
            <span className="text-zinc-400">
              Selected:{" "}
              <span className="text-zinc-200 font-medium">{selected.name}</span>
            </span>
          ) : (
            "Select a brand to continue"
          )}
        </span>
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-semibold hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
