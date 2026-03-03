import React from "react";
import { Settings, Bell, Shield, Database, Palette } from "lucide-react";

const SECTIONS = [
  {
    icon: Shield,
    title: "Security & Auth",
    description: "Admin role assignments, API key rotation, OAuth providers.",
  },
  {
    icon: Database,
    title: "Database Config",
    description: "Connection pooling, cache TTLs, and backup policy.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Slack and email alerts for pipeline errors and anomalies.",
  },
  {
    icon: Palette,
    title: "Platform Appearance",
    description: "Theme defaults, logo, and public-facing brand settings.",
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          System
        </p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform configuration, security policies, and system preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <button
            key={s.title}
            className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-surface hover:bg-surface-elevated hover:border-foreground/15 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-border flex items-center justify-center shrink-0 group-hover:bg-foreground/8 transition-colors">
              <s.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {s.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Danger Zone
        </p>
        <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Flush All Caches
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Force re-fetch of all device data from the CDN edge.
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 text-sm font-semibold hover:bg-red-500/10 transition-colors">
            Flush
          </button>
        </div>
      </div>
    </div>
  );
}
