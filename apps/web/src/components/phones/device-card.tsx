import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   DEVICE CARD
   Structure: image · name · key highlights (3 max) · score
   Style: #151518; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05)
   Hover: slight lift (translateY: -2px), subtle shadow
   NO: scaling, glow explosion
   ────────────────────────────────────────────────────────────── */

interface DeviceSpec {
  label: string
  value: string
}

interface DeviceCardProps {
  slug: string
  name: string
  brand: string
  price: string
  imageUrl: string
  specs: DeviceSpec[]
  badge?: string
  score?: number
  loading?: boolean
  className?: string
}

function DeviceCard({
  slug,
  name,
  brand,
  price,
  imageUrl,
  specs,
  badge,
  score,
  loading = false,
  className,
}: DeviceCardProps) {
  if (loading) {
    return <DeviceCardSkeleton className={className} />
  }

  return (
    <Link
      href={`/phones/${slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.05)] bg-[var(--card)]",
        "transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:translate-y-[-2px] hover:shadow-[var(--tn-shadow-md)] hover:border-[var(--tn-border-strong)]",
        className
      )}
    >
      {/* Image — clean, no heavy shadow */}
      <div className="relative aspect-square bg-[var(--bg-secondary)] flex items-center justify-center p-8 overflow-hidden">
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="secondary">{badge}</Badge>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain opacity-90 transition-opacity duration-[180ms] group-hover:opacity-100"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4">
        {/* Brand + Name */}
        <div className="flex flex-col gap-1">
          <span className="tn-label">{brand}</span>
          <h3 className="text-[15px] font-medium text-[var(--text-primary)] truncate leading-[24px]">
            {name}
          </h3>
        </div>

        {/* Price + Score */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[var(--text-primary)]">
            {price}
          </span>
          {score !== undefined && (
            <span className="text-[13px] font-medium text-[var(--accent)] font-[family-name:var(--font-mono)]">
              {score}/10
            </span>
          )}
        </div>

        {/* Key Highlights — 3 max */}
        {specs.length > 0 && (
          <div className="flex flex-col gap-2 pt-3 border-t border-[var(--divider)]">
            {specs.slice(0, 3).map((spec) => (
              <div key={spec.label} className="flex items-center justify-between">
                <span className="tn-label">{spec.label}</span>
                <span className="text-[13px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

/* ── Skeleton ──────────────────────────────────────────────── */

function DeviceCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.05)] bg-[var(--card)]",
        className
      )}
    >
      <Skeleton className="aspect-square w-full rounded-none" />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16 rounded-[6px]" />
          <Skeleton className="h-5 w-3/4 rounded-[6px]" />
        </div>
        <Skeleton className="h-4 w-20 rounded-[6px]" />
        <div className="flex flex-col gap-2 pt-3 border-t border-[var(--divider)]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-14 rounded-[6px]" />
              <Skeleton className="h-3 w-20 rounded-[6px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { DeviceCard, DeviceCardSkeleton }
export type { DeviceCardProps, DeviceSpec }
