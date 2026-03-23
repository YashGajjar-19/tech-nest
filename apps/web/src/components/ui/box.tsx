import * as React from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   BOX
   Low-level container primitive.
   Use for: cards, containers, sections, surfaces.
   ────────────────────────────────────────────────────────────── */

interface BoxProps extends React.ComponentProps<"div"> {
  as?: "div" | "section" | "article" | "aside" | "main"
}

function Box({ as: Comp = "div", className, ...props }: BoxProps) {
  return (
    <Comp
      data-slot="box"
      className={cn(className)}
      {...props}
    />
  )
}

export { Box }
export type { BoxProps }
