import * as React from "react"
import { cn } from "@/lib/utils"

interface ScoreBarProps {
  label: string
  value: number
  max?: number
  className?: string
}

export function ScoreBar({ label, value, max = 100, className }: ScoreBarProps) {
  // Ensure the value does not exceed max for the percentage width
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span className="text-sm font-bold text-text-primary">{value}</span>
      </div>
      <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden border border-border-subtle/50">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
