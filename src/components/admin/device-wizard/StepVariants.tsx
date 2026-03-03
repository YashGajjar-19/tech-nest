"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useWizard } from "./WizardContext";
import {
  getVariantsAction,
  saveVariantsAction,
} from "@/app/admin/devices/actions";
import type { VariantRow } from "@/types/wizard";
import { Plus, Trash2, Copy, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function genId() {
  return `local_${Math.random().toString(36).slice(2)}`;
}

type LocalVariant = VariantRow & { isDirty?: boolean };

const cellClass =
  "bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-700 w-full px-3 py-2.5 focus:bg-zinc-800/50 rounded transition-colors";

export function StepVariants() {
  const { deviceId, nextStep, prevStep, markStepComplete } = useWizard();

  const [rows, setRows] = useState<LocalVariant[]>([
    { id: genId(), ram_gb: "", storage_gb: "", price: "", color: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing variants (stored as JSON in device_specs)
  useEffect(() => {
    if (!deviceId) { setIsLoading(false); return; }
    getVariantsAction(deviceId).then((result) => {
      if (result.success && result.data && result.data.length > 0) {
        setRows(
          result.data.map((v) => ({
            id: v.id || genId(),
            ram_gb: v.ram_gb ?? "",
            storage_gb: v.storage_gb ?? "",
            price: v.price ?? "",
            color: v.color ?? "",
          }))
        );
      }
      setIsLoading(false);
    });
  }, [deviceId]);

  const updateRow = useCallback(
    (id: string, field: keyof VariantRow, value: string) => {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, [field]: value, isDirty: true } : r
        )
      );
    },
    []
  );

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: genId(), ram_gb: "", storage_gb: "", price: "", color: "", isDirty: true },
    ]);
  };

  const duplicateRow = (id: string) => {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], id: genId(), isDirty: true };
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
    });
  };

  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const saveVariants = useCallback(async () => {
    if (!deviceId) return;
    setIsSaving(true);
    // Strip isDirty before saving
    const clean: VariantRow[] = rows.map(({ isDirty: _d, ...r }) => r);
    await saveVariantsAction(deviceId, clean);
    setRows((prev) => prev.map((r) => ({ ...r, isDirty: false })));
    setIsSaving(false);
  }, [deviceId, rows]);

  const handleContinue = async () => {
    await saveVariants();
    markStepComplete(3);
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Step 3 of 7
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100 tracking-tight">
          Variants
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Define storage, RAM, color, and pricing configurations.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] bg-zinc-900/80 border-b border-zinc-800">
          {["RAM (GB)", "Storage (GB)", "Price (USD)", "Color / Label", ""].map((h) => (
            <div key={h} className="px-3 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row) => (
          <div
            key={row.id}
            className={cn(
              "grid grid-cols-[1fr_1fr_1fr_1fr_auto] border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/30 group transition-colors"
            )}
          >
            <input
              value={row.ram_gb}
              onChange={(e) => updateRow(row.id, "ram_gb", e.target.value)}
              type="number"
              placeholder="8"
              className={cellClass}
            />
            <input
              value={row.storage_gb}
              onChange={(e) => updateRow(row.id, "storage_gb", e.target.value)}
              type="number"
              placeholder="256"
              className={cellClass}
            />
            <input
              value={row.price}
              onChange={(e) => updateRow(row.id, "price", e.target.value)}
              type="number"
              placeholder="999"
              className={cellClass}
            />
            <input
              value={row.color}
              onChange={(e) => updateRow(row.id, "color", e.target.value)}
              placeholder="Titanium Black"
              className={cellClass}
            />
            <div className="flex items-center gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => duplicateRow(row.id)}
                title="Duplicate"
                className="p-1 rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteRow(row.id)}
                title="Delete"
                disabled={rows.length === 1}
                className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add row */}
      <button
        onClick={addRow}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add variant
      </button>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2.5 text-zinc-400 hover:text-zinc-100 rounded-xl text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-semibold hover:bg-white transition-all disabled:opacity-50"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
