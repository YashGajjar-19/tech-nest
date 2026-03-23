import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/* ──────────────────────────────────────────────────────────────
   INPUT
   Rounded 12px · bg: #111113 · subtle border
   Focus: soft accent glow (not neon)
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
        "h-9 w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-secondary)] px-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] outline-none focus-visible:border-[var(--accent)] focus-visible:shadow-[var(--accent-glow)] disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

function InputSkeleton() {
  return <Skeleton className="h-9 w-full rounded-[12px]" />
}

export { Input, InputSkeleton }
