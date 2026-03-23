import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   TEXT
   Typography primitive with variant + size control.
   ────────────────────────────────────────────────────────────── */

const textVariants = cva("font-[family-name:var(--font-body)]", {
  variants: {
    variant: {
      primary: "text-[var(--text-primary)]",
      secondary: "text-[var(--text-secondary)]",
      muted: "text-[var(--text-tertiary)]",
      accent: "text-[var(--accent)]",
    },
    size: {
      xs: "text-[11px] leading-[16px]",
      sm: "text-[13px] leading-[20px]",
      md: "text-[15px] leading-[24px]",
      lg: "text-[17px] leading-[28px]",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
    },
    family: {
      body: "font-[family-name:var(--font-body)]",
      display: "font-[family-name:var(--font-display)]",
      mono: "font-[family-name:var(--font-mono)]",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    weight: "normal",
    family: "body",
  },
})

interface TextProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof textVariants> {
  as?: "span" | "p" | "div" | "label"
}

function Text({
  as: Comp = "span",
  className,
  variant,
  size,
  weight,
  family,
  ...props
}: TextProps) {
  return (
    <Comp
      data-slot="text"
      className={cn(textVariants({ variant, size, weight, family }), className)}
      {...props}
    />
  )
}

export { Text, textVariants }
export type { TextProps }
