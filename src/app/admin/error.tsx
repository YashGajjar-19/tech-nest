"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 rounded-4xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Admin Panel Error</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-10 leading-relaxed font-medium">
        The system encountered an unexpected failure in this administrative view.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-4 bg-foreground text-background text-sm font-bold rounded-2xl flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-foreground/10"
      >
        <RefreshCw className="w-4 h-4" />
        Reload Interface
      </button>
    </div>
  );
}
