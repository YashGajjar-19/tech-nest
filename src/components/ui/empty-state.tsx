import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ElementType;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "glass" | "bordered" | "minimal";
}

export function EmptyState({
  icon: Icon = Info,
  title,
  description,
  action,
  variant = "glass",
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-12 lg:p-20 rounded-[2.5rem]",
        variant === "glass" && "bg-surface/50 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.03)]",
        variant === "bordered" && "bg-transparent border-2 border-dashed border-border-subtle",
        variant === "minimal" && "bg-transparent",
        className
      )}
      {...props}
    >
      <div className={cn(
        "w-20 h-20 rounded-4xl flex items-center justify-center mb-8",
        variant === "minimal" ? "bg-surface border border-border-subtle" : "bg-bg-primary border border-border-subtle shadow-inner"
      )}>
        <Icon className="w-10 h-10 text-text-secondary/50 stroke-[1.5]" />
      </div>
      
      <h3 className="text-2xl font-semibold tracking-tight text-text-primary mb-3">
        {title}
      </h3>
      
      {description && (
        <p className="text-text-secondary max-w-sm mb-8 leading-relaxed">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
