"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { WizardProgress } from "@/types/wizard";

// ── Constants ────────────────────────────────────────────────

export const TOTAL_STEPS = 7;
const STORAGE_KEY = "tn_wizard_progress";

export const STEP_LABELS = [
  "Brand",
  "Identity",
  "Variants",
  "Specifications",
  "Images",
  "Relationships",
  "Review",
] as const;

// ── State shape ──────────────────────────────────────────────

interface WizardState extends WizardProgress {
  isSaving: boolean;
  lastSaved: Date | null;
}

interface WizardContextValue extends WizardState {
  setDeviceId: (id: string) => void;
  setBrand: (id: string, name: string) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepComplete: (step: number) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  resetWizard: () => void;
}

// ── Default state ────────────────────────────────────────────

const DEFAULT_STATE: WizardState = {
  deviceId: null,
  currentStep: 1,
  completedSteps: [],
  brandId: null,
  brandName: null,
  isSaving: false,
  lastSaved: null,
};

// ── Context ──────────────────────────────────────────────────

const WizardContext = createContext<WizardContextValue | null>(null);

// ── Persistence helpers ──────────────────────────────────────

function persistProgress(progress: WizardProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // SSR / private browsing safe
  }
}

function loadProgress(): WizardProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WizardProgress;
  } catch {
    return null;
  }
}

// ── Provider ─────────────────────────────────────────────────

export function WizardProvider({ 
  children,
  initialDeviceId,
  initialBrandId,
  initialBrandName
}: { 
  children: React.ReactNode,
  initialDeviceId?: string,
  initialBrandId?: string,
  initialBrandName?: string
}) {
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);
  const hydrated = useRef(false);

  // Hydrate from localStorage on mount OR from initial props
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    
    // If we are given an initial device to edit, overwrite local storage and start fresh.
    if (initialDeviceId && initialBrandId) {
      const seededState = {
        ...DEFAULT_STATE,
        deviceId: initialDeviceId,
        brandId: initialBrandId,
        brandName: initialBrandName || null,
        currentStep: 2, // Skip brand selection step
        completedSteps: [1] // Mark brand step implicitly completed
      };
      setState(seededState);
      persistProgress(seededState);
      return;
    }

    const saved = loadProgress();
    if (saved) {
      setState((prev) => ({ ...prev, ...saved }));
    }
  }, [initialDeviceId, initialBrandId, initialBrandName]);

  // Persist progress whenever key bits change
  useEffect(() => {
    if (!hydrated.current) return;
    const { deviceId, currentStep, completedSteps, brandId, brandName } = state;
    persistProgress({
      deviceId,
      currentStep,
      completedSteps,
      brandId,
      brandName,
    });
  }, [
    state.deviceId,
    state.currentStep,
    state.completedSteps,
    state.brandId,
    state.brandName,
  ]);

  const setDeviceId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, deviceId: id }));
  }, []);

  const setBrand = useCallback((id: string, name: string) => {
    setState((prev) => ({ ...prev, brandId: id, brandName: name }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const markStepComplete = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      completedSteps: prev.completedSteps.includes(step)
        ? prev.completedSteps
        : [...prev.completedSteps, step],
    }));
  }, []);

  const setIsSaving = useCallback((saving: boolean) => {
    setState((prev) => ({ ...prev, isSaving: saving }));
  }, []);

  const setLastSaved = useCallback((date: Date) => {
    setState((prev) => ({ ...prev, lastSaved: date, isSaving: false }));
  }, []);

  const resetWizard = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setState(DEFAULT_STATE);
  }, []);

  return (
    <WizardContext.Provider
      value={{
        ...state,
        setDeviceId,
        setBrand,
        goToStep,
        nextStep,
        prevStep,
        markStepComplete,
        setIsSaving,
        setLastSaved,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error("useWizard must be used inside <WizardProvider>");
  }
  return ctx;
}
