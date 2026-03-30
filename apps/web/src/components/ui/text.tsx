import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   TEXT
   Typography primitive with variant + size control.
   Uses Geist Sans for body and display, Geist Mono for data.
   ────────────────────────────────────────────────────────────── */

const textVariants = cva("font-[family-name:var(--font-geist-sans)]", {
  variants: {
    variant: {
      primary: "text-[var(--text-primary)]",
      secondary: "text-[var(--text-secondary)]",
      muted: "text-[var(--text-muted)]",
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
      semibold: "font-semibold",
    },
    family: {
      body: "font-[family-name:var(--font-geist-sans)]",
      display: "font-[family-name:var(--font-geist-sans)]",
      mono: "font-[family-name:var(--font-geist-mono)]",
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
  extends React.HTMLAttributes<HTMLElement>,
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
