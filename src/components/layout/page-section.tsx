import React from "react";
import { cn } from "@/lib/utils";

interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  innerClassName?: string;
  containerMode?: "default" | "fluid" | "narrow";
  as?: React.ElementType;
}

export function PageSection({
  children,
  className,
  containerProps,
  innerClassName,
  containerMode = "default",
  as: Component = "section",
  ...props
}: PageSectionProps) {
  return (
    <Component className={cn("py-12 md:py-20 w-full", className)} {...props}>
      <div 
        {...containerProps}
        className={cn(
          "mx-auto px-6 w-full",
          containerMode === "default" && "max-w-7xl",
          containerMode === "narrow" && "max-w-5xl",
          containerMode === "fluid" && "max-w-none",
          innerClassName,
          containerProps?.className
        )}
      >
        {children}
      </div>
    </Component>
  );
}
