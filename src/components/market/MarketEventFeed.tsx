import { formatDistanceToNow } from "date-fns";
import { TrendingDown, ArrowRight, Smartphone, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_EVENTS = [
  {
    id: "e1",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    type: "PRICE_DROP",
    entity: "Google Pixel 8 Pro",
    title: "Pixel 8 Pro drops below $800 threshold.",
    insight: "Google has permanently reduced MSRP by $200 ahead of Q3 earnings. This alters the 'Value' parity score significantly against the Galaxy S24+.",
    impact: "Strong Buy Signal for Android users prioritizing camera systems.",
    icon: TrendingDown,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "e2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    type: "OS_UPDATE",
    entity: "Apple Intelligence rollout",
    title: "iOS 18.1 Beta limits AI features to iPhone 15 Pro.",
    insight: "Confirmation that base iPhone 15 models will not receive generative features. Depreciates long-term longevity score for base models.",
    impact: "Hold/Avoid Base iPhone 15. Pivot to 15 Pro or wait for 16.",
    icon: Smartphone,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
  {
    id: "e3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    type: "SUPPLY_CHAIN",
    entity: "Qualcomm Snapdragon 8 Gen 4",
    title: "Next-gen SOC yields indicate 20% price hike for 2025 flagships.",
    insight: "Supply chain analysis suggests 2025 Android flagships will see a MSRP baseline increase of $100-$150. Current generation (8 Gen 3) devices retain higher residual value.",
    impact: "Acquire late-cycle 2024 flagships during holiday sales to avoid price hikes.",
    icon: RefreshCw,
    color: "text-brand",
    bgColor: "bg-brand/10",
  }
];

export function MarketEventFeed() {
  return (
    <div className="relative border-l border-border-subtle ml-4 sm:ml-6 pl-6 sm:pl-10 space-y-12">
      {MOCK_EVENTS.map((event) => (
        <div key={event.id} className="relative group">
          {/* Timeline Node */}
          <div className="absolute -left-[43px] sm:-left-[59px] mt-1 bg-bg-primary p-1.5 rounded-full border border-border-subtle group-hover:border-text-primary transition-colors z-10">
            <event.icon className={`w-4 h-4 ${event.color}`} />
          </div>

          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                 <span className="text-xs font-mono uppercase tracking-widest text-text-secondary bg-surface px-2 py-0.5 border border-border-subtle rounded">
                   {event.type}
                 </span>
                 <span className="text-xs text-text-secondary">
                   {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                 </span>
               </div>
               <h3 className="text-lg font-semibold text-text-primary mt-2">
                 {event.title}
               </h3>
               <span className="inline-flex items-center text-xs font-medium text-text-primary gap-1.5 opacity-80">
                 Impacts: <span className="underline decoration-border-subtle underline-offset-4">{event.entity}</span>
               </span>
            </div>

            <p className="text-[15px] leading-relaxed text-text-secondary">
              {event.insight}
            </p>

            <div className={`mt-2 p-3 sm:p-4 rounded-xl border border-border-subtle ${event.bgColor} flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between`}>
               <div className="flex gap-3 items-start sm:items-center text-sm font-medium text-text-primary">
                 <CheckCircle2 className={`w-5 h-5 shrink-0 ${event.color} mt-0.5 sm:mt-0`} />
                 <span className="leading-snug">{event.impact}</span>
               </div>
               <Button variant="ghost" size="sm" className="shrink-0 h-8 gap-1.5 bg-bg-primary/50 hover:bg-bg-primary">
                 Adjust Pipeline
                 <ArrowRight className="w-3.5 h-3.5" />
               </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
