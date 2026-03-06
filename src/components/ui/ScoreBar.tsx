import React from "react";
import { cn } from "@/lib/utils";

interface ScoreBarProps {
  score: number; // 0-100
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreBar({ score, label, className, size = "md" }: ScoreBarProps) {
  // Determine how many solid blocks to show (out of 10)
  const filledBlocks = Math.round(score / 10);
  const totalBlocks = 10;
  
  // Size mapping
  const blockHeights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  const blockWidths = {
    sm: "w-1.5",
    md: "w-2.5",
    lg: "w-3"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const scoreSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={cn("flex items-center justify-between w-full font-mono", className)}>
      <span className={cn("text-text-secondary font-sans truncate pr-4", textSizes[size])}>
        {label}
      </span>
      
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex gap-[2px]">
          {Array.from({ length: totalBlocks }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-[1px] transition-colors duration-500",
                blockWidths[size],
                blockHeights[size],
                i < filledBlocks 
                  ? "bg-text-primary dark:bg-text-primary" 
                  : "bg-border-subtle"
              )}
            />
          ))}
        </div>
        <span className={cn("font-medium w-6 text-right", scoreSizes[size])}>
          {score}
        </span>
      </div>
    </div>
  );
}
