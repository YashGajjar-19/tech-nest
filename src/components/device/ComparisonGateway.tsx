import { ArrowRightLeft } from "lucide-react";
import Image from "next/image";

export default function ComparisonGateway() {
  const commonComparisons = [
    { name: "Samsung Galaxy S24 Ultra", label: "Flagship Android Rival" },
    { name: "iPhone 15 Pro", label: "Previous Generation" },
    { name: "Google Pixel 9 Pro", label: "Top Camera Alternative" },
    { name: "iPhone 16 Pro Max", label: "Bigger Battery Variant" },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t bg-background">
      <div className="flex flex-col mb-10">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Comparison Gateway
        </h2>
        <p className="text-muted-foreground text-[15px] mt-2">
          Don't guess. See exact side-by-side differences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {commonComparisons.map((comp, idx) => (
          <button 
            key={idx}
            className="flex flex-col p-6 rounded-3xl bg-surface border border-border-subtle hover:border-text-primary/20 hover:bg-surface-elevated hover:shadow-premium-md group transition-all duration-300 ease-calm text-left relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-bg-primary border border-border-subtle flex items-center justify-center mb-6 transition-colors">
               <ArrowRightLeft className="w-4 h-4 text-text-secondary/60" />
            </div>
            
            <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2 line-clamp-1">
              vs {comp.label}
            </span>
            <span className="text-text-primary font-medium text-lg leading-tight line-clamp-2">
              {comp.name}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-8">
        <button className="flex items-center gap-2 text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors mx-auto underline decoration-text-primary/20 hover:decoration-text-primary/40 underline-offset-4">
          Compare with any custom device
        </button>
      </div>
    </section>
  );
}
