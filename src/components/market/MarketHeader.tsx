import { Filter, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-subtle">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface text-text-primary text-xs font-medium border border-border-subtle">
          <LineChart className="w-3.5 h-3.5 text-text-secondary" />
          <span>Intelligence Feed // Live</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Market Intelligence
        </h1>
        <p className="text-text-secondary">
          Technology market shifts, major launches, and their direct impact on hardware acquisition logic.
        </p>
      </div>
      <div className="flex items-center gap-3">
         <Button variant="outline" size="sm" className="gap-2 h-9 text-text-secondary">
           <Filter className="w-4 h-4" />
           Filter Signals
         </Button>
      </div>
    </div>
  );
}
