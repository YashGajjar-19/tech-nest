import {
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const TIMELINE = [
  {
    date: "Sep 2024",
    event: "Apple iPhone 16 Series Launch",
    impact:
      "Depreciates current iPhone 13 Pro value below optimal trade-in threshold.",
    status: "Upcoming", // Past, Upcoming, Active
  },
  {
    date: "Dec 2024",
    event: "Holiday Price Drops",
    impact: "Optimal buying window for MacBook upgrades.",
    status: "Upcoming",
  },
  {
    date: "Q1 2025",
    event: "Samsung S25 Ultra Release",
    impact: "Significant impact on current decision pipeline (S24 Ultra)",
    status: "Upcoming",
  },
];

export function UpgradeTimeline() {
  return (
    <Card className="border-border-subtle bg-surface shadow-none overflow-hidden p-0">
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-6 px-6">
        <div className="space-y-1.5 focus:outline-none">
          <CardTitle className="text-xl font-medium tracking-tight">Market Impact</CardTitle>
          <CardDescription>
            Market shifts impacting your hardware.
          </CardDescription>
        </div>
        <CalendarDays className="w-5 h-5 text-text-secondary" />
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0">
        <div className="relative border-l pl-4 ml-2 border-border-subtle space-y-8">
          {TIMELINE.map((item, i) => (
            <div key={i} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[26px] mt-1 bg-surface">
                <Circle className="w-5 h-5 text-brand fill-brand/20" />
              </div>

              <div className="space-y-1.5 focus:outline-none z-10">
                <span className="text-xs uppercase tracking-widest font-semibold text-text-secondary">
                  {item.date}
                </span>
                <h4 className="text-sm font-semibold text-text-primary leading-tight">
                  {item.event}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed bg-bg-primary p-3 rounded-lg border border-border-subtle mt-2 flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-orange-400 mt-0.5" />
                  {item.impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
