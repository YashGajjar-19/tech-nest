import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  align?: "left" | "center" | "right";
  size?: "default" | "large" | "small";
}

export function SectionHeader({
  title,
  subtitle,
  actions,
  align = "left",
  size = "default",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col gap-4 mb-10",
        align === "center" && "items-center text-center",
        align === "right" && "items-end text-right",
        (align === "left" && actions) ? "md:flex-row md:items-end justify-between" : "",
        className
      )}
      {...props}
    >
      <div className={cn(
        "space-y-3",
         align === "center" ? "max-w-3xl" : "max-w-2xl"
      )}>
        <h2 className={cn(
          "font-semibold tracking-tight text-text-primary",
          size === "small" && "text-2xl md:text-3xl",
          size === "default" && "text-3xl md:text-4xl",
          size === "large" && "text-4xl md:text-5xl lg:text-6xl leading-[1.1]"
        )}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn(
            "text-text-secondary font-light",
            size === "small" ? "text-base" : "text-lg md:text-xl leading-relaxed"
          )}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className={cn("flex items-center gap-3 shrink-0", align === "left" && "mt-4 md:mt-0")}>
          {actions}
        </div>
      )}
    </div>
  );
}
