import * as React from "react";
import { cn } from "@/lib/utils";

export interface Variant {
  id: string;
  label: string;
  price: string;
  storageGb?: number;
  ramGb?: number;
  isAvailable?: boolean;
}

export interface VariantSelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  variants: Variant[];
  selectedVariantId: string;
  onChange: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onChange,
  className,
  ...props
}: VariantSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)} {...props}>
      {variants.map((variant) => {
        const isSelected = selectedVariantId === variant.id;
        const isAvailable = variant.isAvailable !== false;

        return (
          <button
            key={variant.id}
            disabled={!isAvailable}
            onClick={() => onChange(variant.id)}
            className={cn(
              "flex flex-col items-start px-4 py-3 rounded-lg border text-left transition-all duration-200",
              isSelected
                ? "border-accent bg-accent/5 ring-1 ring-accent text-accent"
                : "border-border-subtle bg-surface text-text-primary hover:border-text-secondary/50",
              !isAvailable &&
                "opacity-50 cursor-not-allowed bg-bg-secondary hover:border-border-subtle hover:bg-bg-secondary",
            )}
            aria-pressed={isSelected}
          >
            <span
              className={cn(
                "text-sm font-medium mb-1",
                isSelected ? "text-accent" : "text-text-primary",
              )}
            >
              {variant.label}
            </span>
            <span
              className={cn(
                "text-xs font-semibold",
                isSelected ? "opacity-90" : "text-text-secondary",
              )}
            >
              {variant.price}
            </span>
          </button>
        );
      })}
    </div>
  );
}
