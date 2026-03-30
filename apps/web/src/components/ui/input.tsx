import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/* ──────────────────────────────────────────────────────────────
   INPUT
   Rounded 12px · bg: surface · focus: accent ring glow
   Geist Sans for input text
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
        "h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:border-[var(--accent)] focus-visible:shadow-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

function InputSkeleton() {
  return <Skeleton className="h-9 w-full rounded-xl" />
}

export { Input, InputSkeleton }
