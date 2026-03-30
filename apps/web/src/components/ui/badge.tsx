import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   BADGE
   Small pill · subtle background · rounded full
   Variants: default (accent) · secondary (accent-subtle) · outline
   ────────────────────────────────────────────────────────────── */

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 rounded-full px-2.5 text-[11px] font-medium whitespace-nowrap font-[family-name:var(--font-geist-sans)] [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-white",
        secondary:
          "bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-muted)]",
        outline:
          "border border-[var(--border)] text-[var(--text-secondary)]",
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
