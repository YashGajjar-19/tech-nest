"use client";

import { useCallback, useRef } from "react";
import { useWizard } from "./WizardContext";

/**
 * Returns a debounced autosave function.
 * Usage:
 *   const autosave = useAutosave();
 *   autosave(() => someServerAction(data));
 */
export function useAutosave(delayMs = 800) {
  const { setIsSaving, setLastSaved } = useWizard();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autosave = useCallback(
    (fn: () => Promise<unknown>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          await fn();
          setLastSaved(new Date());
        } catch (err) {
          console.error("[Autosave] Error:", err);
          // Don't show error state — silent retry is better UX here
        }
      }, delayMs);
    },
    [delayMs, setIsSaving, setLastSaved],
  );

  return autosave;
}
