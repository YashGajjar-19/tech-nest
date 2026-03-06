import React from "react";
import { cn } from "@/lib/utils";

export function DeviceCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "group bg-surface border border-border-subtle rounded-3xl p-6 relative overflow-hidden flex flex-col h-full animate-pulse",
      className
    )}>
      {/* Visual Block Skeleton */}
      <div className="w-full h-[180px] bg-bg-secondary rounded-2xl mb-6" />

      <div className="grow flex flex-col justify-between">
         {/* Title area skeleton */}
         <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
               <div className="w-16 h-4 bg-bg-secondary rounded" />
               <div className="w-10 h-6 bg-bg-secondary rounded shadow-sm" />
            </div>
            <div className="w-48 h-8 bg-bg-secondary rounded mt-2" />
         </div>

         {/* Spec Highlight List skeleton */}
         <div className="space-y-4 mb-6">
            <div className="w-full h-4 bg-bg-secondary rounded" />
            <div className="w-5/6 h-4 bg-bg-secondary rounded" />
            <div className="w-4/6 h-4 bg-bg-secondary rounded" />
         </div>
      </div>
      
      {/* Footer Actions skeleton */}
      <div className="pt-4 border-t border-border-subtle flex justify-between items-center gap-3 mt-auto">
         <div className="w-16 h-6 bg-bg-secondary rounded" />
         <div className="w-12 h-4 bg-bg-secondary rounded" />
      </div>
    </div>
  );
}
