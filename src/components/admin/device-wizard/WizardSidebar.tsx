"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useWizard, STEP_LABELS } from "./WizardContext";
import {
  Tag,
  Smartphone,
  Layers,
  Settings2,
  ImageIcon,
  GitMerge,
  CheckCircle2,
  Check,
  Cloud,
  Loader2,
} from "lucide-react";

const STEP_ICONS = [
  Tag,
  Smartphone,
  Layers,
  Settings2,
  ImageIcon,
  GitMerge,
  CheckCircle2,
];

export function WizardSidebar() {
  const {
    currentStep,
    completedSteps,
    goToStep,
    isSaving,
    lastSaved,
    brandName,
    deviceId,
  } = useWizard();

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-zinc-800/50 bg-[#0d0d0d] h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800/50">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">
          Device Wizard
        </p>
        <h2 className="text-sm font-semibold text-zinc-100 leading-tight">
          {brandName ? `${brandName}` : "New Device"}
        </h2>
        {deviceId && (
          <p className="mt-1 text-[10px] text-zinc-600 font-mono truncate">
            {deviceId}
          </p>
        )}
      </div>

      {/* Steps */}
      <nav className="flex-1 px-4 py-5 space-y-1">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const Icon = STEP_ICONS[i];
          const isDone = completedSteps.includes(stepNum);
          const isCurrent = currentStep === stepNum;
          const isLocked = !isDone && stepNum > currentStep;

          return (
            <button
              key={stepNum}
              onClick={() => {
                // Allow navigating to completed steps or current step
                if (!isLocked) goToStep(stepNum);
              }}
              disabled={isLocked}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                isCurrent
                  ? "bg-zinc-800/70 text-zinc-100"
                  : isDone
                    ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30 cursor-pointer"
                    : "text-zinc-600 cursor-not-allowed",
              )}
            >
              {/* Step indicator */}
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border transition-all",
                  isCurrent
                    ? "bg-zinc-100 text-[#0d0d0d] border-zinc-100"
                    : isDone
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "border-zinc-700 text-zinc-600",
                )}
              >
                {isDone && !isCurrent ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
              </span>

              <span className="truncate font-medium">{label}</span>

              {isCurrent && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-zinc-100 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Autosave indicator */}
      <div className="px-6 py-4 border-t border-zinc-800/50">
        {isSaving ? (
          <span className="flex items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="w-3 h-3 animate-spin" />
            Saving…
          </span>
        ) : lastSaved ? (
          <span className="flex items-center gap-2 text-xs text-zinc-500">
            <Cloud className="w-3 h-3 text-emerald-500/70" />
            Saved{" "}
            {lastSaved.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ) : (
          <span className="text-xs text-zinc-700">Autosave enabled</span>
        )}
      </div>
    </aside>
  );
}
