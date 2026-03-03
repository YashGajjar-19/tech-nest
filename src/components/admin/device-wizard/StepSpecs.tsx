"use client";

import React, { useState, useEffect } from "react";
import { useWizard } from "./WizardContext";
import { useAutosave } from "./useAutosave";
import {
  getSpecSchemaAction,
  getSpecValuesAction,
  upsertSpecValueAction,
} from "@/app/admin/devices/actions";
import { SPEC_SCHEMA } from "@/app/admin/devices/constants";
import type { SpecCategory, SpecKey } from "@/app/admin/devices/constants";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/40 transition-all";

// ── Dynamic spec field ────────────────────────────────────────

function SpecField({
  specKey,
  value,
  onChange,
}: {
  specKey: SpecKey;
  value: string;
  onChange: (val: string) => void;
}) {
  if (specKey.type === "boolean") {
    return (
      <div className="flex gap-2">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-4 py-1.5 rounded-lg border text-xs font-medium transition-all",
              value === opt
                ? "border-zinc-400/60 bg-zinc-800 text-zinc-100"
                : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }
  return (
    <input
      type={specKey.type === "number" ? "number" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={specKey.unit ? `e.g. 4500 ${specKey.unit}` : "—"}
      className={inputClass}
    />
  );
}

// ── Main component ────────────────────────────────────────────

export function StepSpecs() {
  const { deviceId, nextStep, prevStep, markStepComplete } = useWizard();
  const autosave = useAutosave(600);

  // categories come from the hardcoded SPEC_SCHEMA in actions
  const [categories, setCategories] = useState<SpecCategory[]>(SPEC_SCHEMA);
  const [values, setValues] = useState<Record<string, string>>({}); // spec_key → value
  const [activeTab, setActiveTab] = useState<string>(SPEC_SCHEMA[0]?.id ?? "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [schemaResult, valuesResult] = await Promise.all([
        getSpecSchemaAction(),
        deviceId
          ? getSpecValuesAction(deviceId)
          : Promise.resolve({ success: true as const, data: {} }),
      ]);

      if (schemaResult.success && schemaResult.data) {
        setCategories(schemaResult.data);
        if (schemaResult.data.length > 0 && !activeTab) {
          setActiveTab(schemaResult.data[0].id);
        }
      }

      if (valuesResult.success && valuesResult.data) {
        setValues(valuesResult.data as Record<string, string>);
      }

      setIsLoading(false);
    };
    load();
  }, [deviceId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (specKey: string, val: string) => {
    setValues((prev) => ({ ...prev, [specKey]: val }));
    if (!deviceId) return;
    autosave(() => upsertSpecValueAction(deviceId, specKey, val));
  };

  const activeCategory = categories.find((c) => c.id === activeTab);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Step 4 of 7
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100 tracking-tight">
          Specifications
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill in spec fields. Changes autosave instantly.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
              activeTab === cat.id
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                : "text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-zinc-800",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Spec fields */}
      <div className="space-y-4">
        {!activeCategory || activeCategory.keys.length === 0 ? (
          <p className="text-sm text-zinc-600 py-4">
            No specs in this category.
          </p>
        ) : (
          activeCategory.keys.map((sk) => (
            <div
              key={sk.key}
              className="grid grid-cols-[180px_1fr] items-center gap-4"
            >
              <div>
                <p className="text-sm font-medium text-zinc-300">{sk.label}</p>
                {sk.unit && <p className="text-xs text-zinc-600">{sk.unit}</p>}
              </div>
              <SpecField
                specKey={sk}
                value={values[sk.key] ?? ""}
                onChange={(val) => handleChange(sk.key, val)}
              />
            </div>
          ))
        )}
      </div>

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
          onClick={() => {
            markStepComplete(4);
            nextStep();
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-semibold hover:bg-white transition-all"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
