import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CategoryCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  name: string
  icon?: React.ReactNode
  deviceCount?: number
  href: string
}

export function CategoryCard({ name, icon, deviceCount, href, className, ...props }: CategoryCardProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface p-6 border border-border-subtle shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/40",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start mb-12">
        <div className="p-3 bg-bg-secondary rounded-xl text-text-primary group-hover:bg-accent group-hover:text-bg-primary transition-colors">
          {icon || <div className="w-6 h-6 rounded-md bg-text-primary/10" />}
        </div>
        <ArrowRight className="w-5 h-5 text-text-secondary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent" />
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight text-text-primary mb-1">
          {name}
        </h3>
        {deviceCount !== undefined && (
          <p className="text-sm text-text-secondary font-medium">
            {deviceCount} devices
          </p>
        )}
      </div>

      {/* Decorative gradient bleed */}
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-accent/5 rounded-full blur-3xl transition-transform group-hover:scale-150" />
    </Link>
  )
}
