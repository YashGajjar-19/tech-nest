import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/* ──────────────────────────────────────────────────────────────
   INPUT
   Consistent height, border, focus ring.
   Supports loading skeleton.
   ────────────────────────────────────────────────────────────── */

interface InputProps extends React.ComponentProps<"input"> {
  loading?: boolean
}

function Input({ className, type, loading = false, ...props }: InputProps) {
  if (loading) {
    return <InputSkeleton />
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full rounded-lg border border-tn-border bg-tn-surface px-3 text-sm text-tn-text-primary placeholder:text-tn-text-muted transition-colors duration-200 outline-none focus-visible:border-tn-accent focus-visible:ring-2 focus-visible:ring-tn-accent/20 disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

function InputSkeleton() {
  return <Skeleton className="h-9 w-full rounded-lg" />
}

export { Input, InputSkeleton }
