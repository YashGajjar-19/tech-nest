import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreBar } from "@/components/ui/ScoreBar";

interface DecisionCardProps {
  id: string;
  name: string;
  brand: string;
  score: number;
  price: string;
  highlights: string[];
  imagePlaceholderText?: string;
  className?: string;
  href?: string;
}

export function DecisionCard({
  id,
  name,
  brand,
  score,
  price,
  highlights,
  imagePlaceholderText = "Image",
  className,
  href
}: DecisionCardProps) {
  
  const CardContent = (
    <div className={cn(
      "group bg-surface border border-border-subtle rounded-3xl p-6 transition-all duration-300",
      "hover:border-accent/40 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_40px_-10px_rgba(255,255,255,0.03)] hover:-translate-y-1 relative overflow-hidden flex flex-col h-full",
      className
    )}>
      {/* Visual Block */}
      <div className="w-full h-[180px] bg-bg-secondary rounded-2xl mb-6 flex flex-col items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
         <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold opacity-60">
            {imagePlaceholderText}
         </div>
         {/* Subtle gradient overlay */}
         <div className="absolute inset-0 bg-linear-to-tr from-surface/20 to-transparent pointer-events-none" />
      </div>

      <div className="grow flex flex-col justify-between">
         {/* Title area */}
         <div className="mb-6">
            <div className="flex justify-between items-start mb-1">
               <span className="text-xs uppercase tracking-wider font-semibold text-text-secondary">
                  {brand}
               </span>
               <span className="text-xl font-medium tracking-tight bg-text-primary text-surface px-2 py-0.5 rounded shadow-sm leading-none flex items-center">
                  {score}
               </span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors">
               {name}
            </h3>
         </div>

         {/* Spec Highlight List */}
         <div className="space-y-2 mb-6 text-sm text-text-secondary">
            {highlights.slice(0, 3).map((item, idx) => (
               <div key={idx} className="flex items-start">
                  <Check className="w-4 h-4 mr-2 mt-0.5 text-accent opacity-80" />
                  <span>{item}</span>
               </div>
            ))}
         </div>
      </div>
      
      {/* Footer Actions */}
      <div className="pt-4 border-t border-border-subtle flex flex-wrap justify-between items-center gap-3">
         <span className="text-lg font-medium">{price}</span>
         
         <div className="flex items-center gap-3 text-sm">
            <span className="text-text-secondary group-hover:text-text-primary transition-colors flex items-center font-medium">
               View <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </span>
         </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
         {CardContent}
      </Link>
    );
  }

  return CardContent;
}
