import React from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
} from "lucide-react";

const STATS = [
  { label: "Page Views (7d)", value: "24,841", delta: "+18%", icon: Eye },
  { label: "Unique Visitors", value: "9,203", delta: "+12%", icon: Users },
  {
    label: "Decision Clicks",
    value: "3,617",
    delta: "+31%",
    icon: MousePointerClick,
  },
  { label: "Avg. Session", value: "4m 12s", delta: "+0:22", icon: TrendingUp },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          System
        </p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform usage, decision engagement, and growth metrics.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-surface p-5 group hover:bg-surface-elevated transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {s.label}
              </p>
              <div className="w-7 h-7 rounded-lg bg-foreground/5 flex items-center justify-center">
                <s.icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-emerald-500 font-medium">
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-8 flex flex-col items-center justify-center gap-3 min-h-[320px]">
        <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          Analytics Dashboard
        </h3>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Full analytics charts, funnel analysis, and device engagement heatmaps
          will connect to PostHog / Plausible in Phase 2.
        </p>
      </div>
    </div>
  );
}
