import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/* ──────────────────────────────────────────────────────────────
   BUTTON
   Variants: primary · secondary · ghost
   Sizes:    sm · md · lg
   ────────────────────────────────────────────────────────────── */

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-tn-accent focus-visible:ring-offset-2 focus-visible:ring-offset-tn-bg disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-tn-accent text-tn-text-inverse hover:bg-tn-accent-hover",
        secondary:
          "bg-tn-surface border border-tn-border text-tn-text-primary hover:border-tn-border-strong hover:bg-tn-bg-secondary",
        ghost:
          "text-tn-text-secondary hover:bg-tn-bg-secondary hover:text-tn-text-primary",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 text-sm",
        md: "h-9 gap-2 px-4 text-sm",
        lg: "h-10 gap-2 px-6 text-sm",
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

  return <Skeleton className={cn(heightClass, widthClass, "rounded-lg")} />
}

export { Button, ButtonSkeleton, buttonVariants }
