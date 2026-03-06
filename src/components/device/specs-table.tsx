import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpecItem {
  key: string
  label: string
  value: string
}

export interface SpecCategory {
  title: string
  items: SpecItem[]
}

export interface SpecsTableProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: SpecCategory[]
}

export function SpecsTable({ categories, className, ...props }: SpecsTableProps) {
  return (
    <div className={cn("w-full rounded-xl overflow-hidden border border-border-subtle bg-surface", className)} {...props}>
      {categories.map((category, idx) => (
        <div key={category.title} className={cn("group", idx !== 0 && "border-t border-border-subtle")}>
          <div className="bg-bg-secondary px-6 py-3">
            <h4 className="text-sm font-semibold tracking-tight text-text-primary uppercase group-hover:text-accent transition-colors">
              {category.title}
            </h4>
          </div>
          <div className="divide-y divide-border-subtle/50">
            {category.items.map((item) => (
              <div key={item.key} className="flex flex-col sm:flex-row px-6 py-3 hover:bg-bg-secondary/30 transition-colors">
                <div className="w-1/3 text-sm font-medium text-text-secondary sm:py-1">
                  {item.label}
                </div>
                <div className="w-2/3 text-sm text-text-primary sm:py-1">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
