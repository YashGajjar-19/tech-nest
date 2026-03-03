 import { BrainCircuit, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalystHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-subtle">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-medium border border-brand/20">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Intelligence Pipeline: v2.1.4 Connected</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          AI Analyst Workspace
        </h1>
        <p className="text-text-secondary">
          Run decision simulations, guided discovery, and market logic queries.
        </p>
      </div>
      <div className="flex items-center gap-3">
         <Button variant="outline" size="sm" className="gap-2 h-9 text-text-secondary">
           <Settings2 className="w-4 h-4" />
           Agent Parameters
         </Button>
      </div>
    </div>
  );
}
