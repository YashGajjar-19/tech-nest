"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizard } from "./WizardContext";
import {
  getDeviceForReviewAction,
  getVariantsAction,
  getSpecValuesAction,
  getRelationshipsAction,
  publishDeviceAction,
} from "@/app/admin/devices/actions";
import type {
  Device,
  Brand,
  VariantRow,
  DeviceRelationship,
} from "@/types/wizard";
import {
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Circle,
  Rocket,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewData {
  device: (Device & { brands?: Brand }) | null;
  variants: VariantRow[];
  specs: Record<string, string>; // spec_key → value
  relationships: DeviceRelationship[];
}

function CheckItem({
  done,
  label,
  count,
}: {
  done: boolean;
  label: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-800/50 last:border-0">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-zinc-700 shrink-0" />
      )}
      <span
        className={cn(
          "text-sm flex-1",
          done ? "text-zinc-200" : "text-zinc-500",
        )}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-zinc-500 font-mono">{count}</span>
      )}
    </div>
  );
}

export function StepReview() {
  const { deviceId, prevStep, resetWizard } = useWizard();
  const router = useRouter();

  const [data, setData] = useState<ReviewData>({
    device: null,
    variants: [],
    specs: {},
    relationships: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!deviceId) {
      setIsLoading(false);
      return;
    }
    Promise.all([
      getDeviceForReviewAction(deviceId),
      getVariantsAction(deviceId),
      getSpecValuesAction(deviceId),
      getRelationshipsAction(deviceId),
    ]).then(([deviceResult, varResult, specResult, relResult]) => {
      setData({
        device: deviceResult.success
          ? (deviceResult.data as ReviewData["device"])
          : null,
        variants: varResult.success ? (varResult.data ?? []) : [],
        specs: specResult.success ? ((specResult.data as Record<string, string>) ?? {}) : {},
        relationships: relResult.success ? (relResult.data ?? []) : [],
      });
      setIsLoading(false);
    });
  }, [deviceId]);

  const filledSpecs = Object.values(data.specs).filter(Boolean).length;
  const totalSpecs = Object.keys(data.specs).length;
  const completeness =
    totalSpecs > 0 ? Math.round((filledSpecs / totalSpecs) * 100) : 0;

  // publishDeviceAction now takes a boolean
  const handlePublish = async (publish: boolean) => {
    if (!deviceId) return;
    setIsPublishing(true);
    setPublishError(null);
    const result = await publishDeviceAction(deviceId, publish);
    if (result.success) {
      setDone(true);
      setTimeout(() => {
        resetWizard();
        router.push("/admin/devices");
      }, 1800);
    } else {
      setPublishError(result.error ?? "Failed to update status");
    }
    setIsPublishing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-100">Device saved!</h2>
        <p className="text-sm text-zinc-500">Redirecting to devices list…</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Step 7 of 7
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100 tracking-tight">
          Review & Publish
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Verify completeness before publishing.
        </p>
      </div>

      {/* Device summary */}
      {data.device && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 space-y-1">
          <p className="text-base font-semibold text-zinc-100">
            {data.device.name}
          </p>
          <p className="text-xs text-zinc-500 font-mono">{data.device.slug}</p>
          <div className="flex gap-3 mt-2">
            {data.device.price != null && (
              <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                ${Number(data.device.price).toLocaleString()}
              </span>
            )}
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-semibold",
              data.device.is_published
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-zinc-800 text-zinc-400"
            )}>
              {data.device.is_published ? "Published" : "Draft"}
            </span>
          </div>
          {data.device.short_summary && (
            <p className="text-xs text-zinc-500 pt-1 leading-relaxed">
              {data.device.short_summary}
            </p>
          )}
        </div>
      )}

      {/* Spec completeness bar */}
      {totalSpecs > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-medium">Spec Completeness</span>
            <span className="text-zinc-300 font-semibold">{completeness}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <p className="text-xs text-zinc-600">
            {filledSpecs} of {totalSpecs} specs filled
          </p>
        </div>
      )}

      {/* Checklist */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            Completion Checklist
          </h3>
        </div>
        <div className="px-5">
          <CheckItem done={!!data.device?.brand_id} label="Brand selected" />
          <CheckItem
            done={!!data.device?.name && !!data.device?.slug}
            label="Device identity set"
          />
          <CheckItem
            done={data.variants.length > 0}
            label="Variants defined"
            count={data.variants.length}
          />
          <CheckItem
            done={filledSpecs > 0}
            label="Specifications added"
            count={filledSpecs}
          />
          <CheckItem
            done={!!data.device?.image_url}
            label="Hero image set"
          />
          <CheckItem
            done={data.relationships.length > 0}
            label="Relationships linked"
            count={data.relationships.length}
          />
        </div>
      </div>

      {publishError && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {publishError}
        </p>
      )}

      {/* Navigation + actions */}
      <div className="flex items-center justify-between pt-2 gap-3">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2.5 text-zinc-400 hover:text-zinc-100 rounded-xl text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => handlePublish(false)}
            disabled={isPublishing}
            className="flex items-center gap-2 px-4 py-2.5 border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          >
            <FileCheck className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handlePublish(true)}
            disabled={isPublishing}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 hover:bg-white rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4" />
            )}
            Publish Device
          </button>
        </div>
      </div>
    </div>
  );
}
