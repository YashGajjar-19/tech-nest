import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   BADGE
   Variants: default · secondary · outline
   ────────────────────────────────────────────────────────────── */

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "bg-tn-accent text-tn-text-inverse",
        secondary:
          "bg-tn-bg-secondary text-tn-text-secondary border border-tn-border-subtle",
        outline:
          "border border-tn-border text-tn-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
