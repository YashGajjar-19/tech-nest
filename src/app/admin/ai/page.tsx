import React from "react";
import { BrainCircuit, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const QUEUE = [
  { device: "iPhone 16 Pro",        type: "Decision Summary", status: "ready",   age: "2 min ago" },
  { device: "Galaxy S25 Ultra",     type: "Comparison Brief", status: "ready",   age: "5 min ago" },
  { device: "Pixel 9 Pro XL",       type: "Decision Summary", status: "pending", age: "12 min ago" },
  { device: "OnePlus 13 Pro",       type: "Spec Narrative",   status: "pending", age: "18 min ago" },
  { device: "Xiaomi 15 Ultra",      type: "Decision Summary", status: "error",   age: "34 min ago" },
];

const STATUS_STYLE: Record<string, string> = {
  ready:   "text-emerald-500 bg-emerald-500/8 border-emerald-500/20",
  pending: "text-amber-500 bg-amber-500/8 border-amber-500/20",
  error:   "text-red-400 bg-red-500/8 border-red-500/20",
};

const STATUS_ICON: Record<string, React.ElementType> = {
  ready:   CheckCircle2,
  pending: Clock,
  error:   AlertCircle,
};

export default function AdminAIPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Intelligence</p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Insights</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and approve AI-generated device summaries before they go live.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-surface text-sm">
          <BrainCircuit className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">15</span>
          <span className="text-muted-foreground">pending</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Generation Queue</p>
        </div>
        <div className="divide-y divide-border">
          {QUEUE.map((item, i) => {
            const Icon = STATUS_ICON[item.status];
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-elevated transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.device}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.type}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full border uppercase tracking-wide ${STATUS_STYLE[item.status]}`}>
                  <Icon className="w-3 h-3" />
                  {item.status}
                </span>
                <span className="text-xs text-muted-foreground w-20 text-right">{item.age}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-xs px-2.5 py-1 rounded-lg bg-foreground text-background font-medium">
                    Approve
                  </button>
                  <button className="text-xs px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground font-medium">
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
