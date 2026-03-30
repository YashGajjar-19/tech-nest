import * as React from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   CARD SYSTEM — "Dual-Soul"

   Dark (Linear): #0F0F10, 1px border #1F1F22, nested depth
   Light (Apple): #FFFFFF, no border, airy shadow pedestal
   
   Hover: translateY(-2px), elevated shadow — no scale, no glow
   "Pulse" top-edge glow via .tn-card CSS class
   ────────────────────────────────────────────────────────────── */

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "tn-card flex flex-col gap-4 overflow-hidden p-5",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-[17px] font-semibold tracking-[-0.015em] text-[var(--text-primary)] font-[family-name:var(--font-geist-sans)]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "text-[13px] leading-[20px] text-[var(--text-secondary)]",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center border-t border-[var(--divider)] pt-4",
        className
      )}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
