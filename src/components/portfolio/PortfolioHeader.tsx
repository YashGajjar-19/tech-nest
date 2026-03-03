import { Settings, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PortfolioHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-subtle">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-medium border border-brand/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local Intelligence Active</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Portfolio
        </h1>
        <p className="text-text-secondary">
          Your personal technology inventory and intelligence hub.
        </p>
      </div>
      <div className="flex items-center gap-3">
         <Button variant="outline" size="sm" className="gap-2 h-9 text-text-secondary">
           <Settings className="w-4 h-4" />
           Preferences
         </Button>
         <Button variant="outline" size="sm" className="gap-2 h-9 text-text-secondary border-red-500/20 hover:bg-red-500/10 hover:text-red-500">
           <LogOut className="w-4 h-4" />
           Clear Session
         </Button>
      </div>
    </div>
  );
}
