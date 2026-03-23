import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   STACK
   Vertical layout primitive with controlled spacing.
   ────────────────────────────────────────────────────────────── */

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",      // 4px
      sm: "gap-2",      // 8px
      md: "gap-4",      // 16px
      lg: "gap-6",      // 24px
      xl: "gap-8",      // 32px
      "2xl": "gap-12",  // 48px
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
  },
})

interface StackProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof stackVariants> {}

function Stack({ className, gap, align, ...props }: StackProps) {
  return (
    <div
      data-slot="stack"
      className={cn(stackVariants({ gap, align }), className)}
      {...props}
    />
  )
}

export { Stack, stackVariants }
export type { StackProps }
