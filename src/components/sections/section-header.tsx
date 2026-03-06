import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, subtitle, action, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6", className)} 
        {...props}
      >
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-lg text-text-secondary font-light">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    )
  }
)
SectionHeader.displayName = "SectionHeader"

export { SectionHeader }
