import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Smartphone, ArrowRight, Battery, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GenerativeWorkspace() {
  return (
    <div className="space-y-6">
      <div className="text-sm text-text-secondary bg-surface rounded-xl p-4 border border-border-subtle inline-block float-right max-w-[80%]">
        If I upgrade to the S24 Ultra now, what is the cost delta vs waiting for the S25?
      </div>
      <div className="clear-both" />

      {/* Simulated Generative UI Response */}
      <div className="space-y-4 max-w-[90%] float-left">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 border border-brand/20 mt-1">
            <LineChart className="w-4 h-4" />
          </div>
          <div className="space-y-6 flex-1">
            <p className="text-text-primary leading-relaxed text-[15px]">
              Based on historical Samsung pricing data and current market depreciation curves, acquiring the <span className="font-semibold text-brand">Galaxy S24 Ultra</span> today versus waiting 6 months for the S25 launch presents a specific financial tradeoff. Here is the simulated breakdown.
            </p>
            
            <Card className="border-border-subtle overflow-hidden bg-bg-primary">
               <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-subtle">
                    {/* Option A */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                         <h4 className="font-semibold text-text-primary flex items-center gap-2">
                           <Smartphone className="w-4 h-4 text-text-secondary" /> Buy S24 Ultra Now
                         </h4>
                         <span className="text-xs uppercase tracking-widest font-semibold text-text-secondary bg-surface px-2 py-1 rounded border border-border-subtle">Base Case</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end border-b border-border-subtle pb-2">
                          <span className="text-sm text-text-secondary">Current Market Est.</span>
                          <span className="font-medium text-text-primary">$1,150</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-border-subtle pb-2">
                           <span className="text-sm text-text-secondary">Est. Value in 6 Mo.</span>
                           <span className="font-medium text-text-primary">$890</span>
                        </div>
                        <div className="flex justify-between items-end pb-2">
                           <span className="text-sm text-text-secondary">Net 6 Mo. Cost</span>
                           <span className="font-semibold text-orange-400">-$260 Depreciation</span>
                        </div>
                      </div>
                    </div>
                    {/* Option B */}
                    <div className="p-6 bg-surface/30">
                      <div className="flex justify-between items-start mb-4">
                         <h4 className="font-semibold text-text-primary flex items-center gap-2">
                           <Smartphone className="w-4 h-4 text-brand" /> Wait for S25 Ultra
                         </h4>
                         <span className="text-xs uppercase tracking-widest font-semibold text-brand bg-brand/10 px-2 py-1 rounded border border-brand/20">AI Recommended</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end border-b border-border-subtle pb-2">
                          <span className="text-sm text-text-secondary">Est. Launch Price</span>
                          <span className="font-medium text-text-primary">$1,299 MSRP</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-border-subtle pb-2">
                           <span className="text-sm text-text-secondary">Expected Upgrades</span>
                           <span className="font-medium text-text-primary text-right text-xs">Snapdragon 8 Gen 4<br/>Better Efficiency</span>
                        </div>
                        <div className="flex justify-between items-end pb-2">
                           <span className="text-sm text-text-secondary">Recommendation Logic</span>
                           <span className="font-semibold text-emerald-500 text-xs text-right max-w-[150px]">Avoid late-cycle premium purchases.</span>
                        </div>
                      </div>
                    </div>
                  </div>
               </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button size="sm" variant="outline" className="gap-2 h-8 rounded-full text-xs">
                Simulate Trade-in
              </Button>
              <Button size="sm" variant="outline" className="gap-2 h-8 rounded-full text-xs">
                Compare S24 vs S23 Value
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="clear-both" />
    </div>
  );
}
