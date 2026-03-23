import * as React from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   HEADING
   Semantic heading with level-based styling.
   Maps: 1→tn-h1  2→tn-h2  3→tn-h3  4→tn-h4
   ────────────────────────────────────────────────────────────── */

const headingStyles: Record<1 | 2 | 3 | 4, string> = {
  1: "tn-h1",
  2: "tn-h2",
  3: "tn-h3",
  4: "tn-h4",
}

interface HeadingProps extends React.ComponentProps<"h1"> {
  level?: 1 | 2 | 3 | 4
}

function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const

  return (
    <Tag
      data-slot="heading"
      className={cn(headingStyles[level], className)}
      {...props}
    />
  )
}

export { Heading }
export type { HeadingProps }
