"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useWizard } from "./WizardContext";
import { useAutosave } from "./useAutosave";
import {
  createDeviceAction,
  updateDeviceAction,
  getDeviceForReviewAction,
} from "@/app/admin/devices/actions";
import { slugify } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// ── Input primitive ───────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-zinc-600 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-zinc-600">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/40 transition-all";

// ── Component ─────────────────────────────────────────────────

export function StepIdentity() {
  const {
    brandId,
    brandName,
    deviceId,
    setDeviceId,
    nextStep,
    prevStep,
    markStepComplete,
  } = useWizard();
  const autosave = useAutosave(800);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");
  const [price, setPrice] = useState("");
  const [shortSummary, setShortSummary] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from DB if editing an existing device
  useEffect(() => {
    if (deviceId && !name) {
      getDeviceForReviewAction(deviceId).then((res) => {
        if (res.success && res.data) {
          setName(res.data.name || "");
          setSlug(res.data.slug || "");
          setReleaseDate(res.data.release_date || "");
          setPrice(res.data.price?.toString() || "");
          setShortSummary(res.data.short_summary || "");
          setSlugManual(true); // Prevent auto-slug override of DB slug
        }
      });
    }
  }, [deviceId]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(name));
    }
  }, [name, slugManual]);

  // Build payload matching real schema
  const buildPayload = useCallback(
    () => ({
      brand_id: brandId!,
      name: name.trim(),
      slug: slug.trim(),
      release_date: releaseDate || null,
      price: price ? Number(price) : null,
      short_summary: shortSummary.trim() || null,
    }),
    [brandId, name, slug, releaseDate, price, shortSummary]
  );

  // Autosave on edit if device already exists
  useEffect(() => {
    if (!deviceId || !name.trim() || !slug.trim()) return;
    autosave(() => updateDeviceAction(deviceId, buildPayload()));
  }, [name, slug, releaseDate, price, shortSummary]); // eslint-disable-line react-hooks/exhaustive-deps

  const isValid = name.trim().length > 0 && slug.trim().length > 0;

  const handleContinue = async () => {
    if (!isValid || !brandId) return;
    setError(null);

    if (!deviceId) {
      setIsCreating(true);
      const result = await createDeviceAction(buildPayload());
      setIsCreating(false);
      if (!result.success || !result.data) {
        setError(result.error ?? "Failed to create device");
        return;
      }
      setDeviceId(result.data.id);
    } else {
      await updateDeviceAction(deviceId, buildPayload());
    }

    markStepComplete(2);
    nextStep();
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Step 2 of 7
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100 tracking-tight">
          Device Identity
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {brandName ? (
            <>
              Core details for{" "}
              <span className="text-zinc-300">{brandName}</span> device
            </>
          ) : (
            "Core details for this device"
          )}
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        <Field label="Device Name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Galaxy S25 Ultra"
            className={inputClass}
          />
        </Field>

        <Field
          label="URL Slug"
          required
          hint="Auto-generated from name. Edit to customise."
        >
          <input
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(e.target.value);
            }}
            placeholder="galaxy-s25-ultra"
            className={`${inputClass} font-mono text-xs`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Release Date">
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className={`${inputClass} scheme-dark`}
            />
          </Field>

          <Field label="Base Price (USD)">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="999"
              min="0"
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label="Short Summary"
          hint="One or two sentences describing this device at a glance."
        >
          <textarea
            value={shortSummary}
            onChange={(e) => setShortSummary(e.target.value)}
            placeholder="The ultimate flagship with a 200MP camera, titanium build, and 5000mAh battery…"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

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
          disabled={!isValid || isCreating}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-semibold hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
          {deviceId ? "Next" : "Create & Continue"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
