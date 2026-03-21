import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   DEVICE CARD
   Displays: image · name · brand · price · 2–3 quick specs
   Supports: loading skeleton via loading prop
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
        "tn-card group flex flex-col rounded-lg overflow-hidden transition-colors duration-200 hover:border-tn-border-strong",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-tn-bg-secondary flex items-center justify-center p-6 overflow-hidden">
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="default">{badge}</Badge>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-opacity duration-200"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4">
        {/* Brand + Name */}
        <div className="flex flex-col gap-1">
          <span className="tn-label">{brand}</span>
          <h3 className="tn-h4 text-tn-text-primary truncate">{name}</h3>
        </div>

        {/* Price */}
        <span className="tn-body-sm font-medium text-tn-text-primary">{price}</span>

        {/* Quick Specs */}
        {specs.length > 0 && (
          <div className="flex flex-col gap-2 pt-3 border-t border-tn-border-subtle">
            {specs.slice(0, 3).map((spec) => (
              <div key={spec.label} className="flex items-center justify-between">
                <span className="tn-label">{spec.label}</span>
                <span className="tn-spec text-tn-text-secondary">{spec.value}</span>
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
        "tn-card flex flex-col rounded-lg overflow-hidden",
        className
      )}
    >
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full rounded-none" />

      {/* Info placeholder */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-5 w-3/4 rounded" />
        </div>
        <Skeleton className="h-4 w-20 rounded" />
        <div className="flex flex-col gap-2 pt-3 border-t border-tn-border-subtle">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-12 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export { DeviceCard, DeviceCardSkeleton }
export type { DeviceCardProps, DeviceSpec }
