import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/* ──────────────────────────────────────────────────────────────
   BUTTON
   Variants: primary · secondary · ghost
   Sizes:    sm · md · lg
   
   Rules:
   · Primary = filled accent, radius 10px
   · Secondary = ghost, border only
   · Interaction: opacity change (not scale), 120–180ms
   ────────────────────────────────────────────────────────────── */

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[10px] font-medium whitespace-nowrap outline-none select-none transition-opacity duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent)] text-white hover:opacity-90",
        secondary:
          "bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:opacity-80 hover:border-[var(--tn-border-strong)]",
        ghost:
          "text-[var(--text-secondary)] hover:opacity-80 hover:text-[var(--text-primary)]",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 text-[13px]",
        md: "h-9 gap-2 px-4 text-[13px]",
        lg: "h-10 gap-2 px-6 text-[15px]",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  loading = false,
  children,
  ...props
}: ButtonProps) {
  if (loading) {
    return <ButtonSkeleton size={size} />
  }

  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  )
}

function ButtonSkeleton({
  size = "md",
}: {
  size?: "sm" | "md" | "lg" | "icon" | "icon-sm" | null
}) {
  const widthClass =
    size === "sm"
      ? "w-20"
      : size === "lg"
        ? "w-32"
        : size === "icon" || size === "icon-sm"
          ? "w-9"
          : "w-24"

  const heightClass =
    size === "sm"
      ? "h-8"
      : size === "lg"
        ? "h-10"
        : size === "icon"
          ? "h-9"
          : size === "icon-sm"
            ? "h-8"
            : "h-9"

  return <Skeleton className={cn(heightClass, widthClass, "rounded-[10px]")} />
}

export { Button, ButtonSkeleton, buttonVariants }
