import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   INLINE
   Horizontal layout primitive with justify + align control.
   ────────────────────────────────────────────────────────────── */

const inlineVariants = cva("flex flex-row", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    gap: "md",
    justify: "start",
    align: "center",
    wrap: false,
  },
})

interface InlineProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof inlineVariants> {}

function Inline({ className, gap, justify, align, wrap, ...props }: InlineProps) {
  return (
    <div
      data-slot="inline"
      className={cn(inlineVariants({ gap, justify, align, wrap }), className)}
      {...props}
    />
  )
}

export { Inline, inlineVariants }
export type { InlineProps }
