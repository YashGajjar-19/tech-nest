import React from "react";
import { Network, Zap, AlertCircle } from "lucide-react";

const ENGINE_STATS = [
  { label: "Decisions Generated Today", value: "3,841", delta: "+12%" },
  { label: "Avg. Confidence Score",     value: "87.4%",  delta: "+1.2%" },
  { label: "Models in Production",      value: "4",       delta: "" },
  { label: "Avg. Latency",             value: "142ms",   delta: "-8ms" },
];

export default function AdminEnginePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Intelligence</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Decision Engine</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor the scoring algorithm, model performance, and decision quality.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ENGINE_STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{s.label}</p>
            <p className="text-2xl font-bold text-foreground tracking-tight">{s.value}</p>
            {s.delta && (
              <p className="mt-1 text-xs text-emerald-500 font-medium">{s.delta}</p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-8 flex flex-col items-center justify-center gap-3 min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
          <Network className="w-5 h-5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Decision Engine Console</h3>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Real-time scoring visualization, A/B test management, and weight tuning coming in Phase 2.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium mt-2">
          <AlertCircle className="w-3.5 h-3.5" />
          Planned — Phase 2
        </div>
      </div>
    </div>
  );
}
