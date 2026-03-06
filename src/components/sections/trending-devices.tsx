import * as React from "react"
import { DeviceCard, type DeviceCardProps } from "@/components/device/device-card"
import { cn } from "@/lib/utils"

export interface TrendingDevicesGridProps extends React.HTMLAttributes<HTMLDivElement> {
  devices: DeviceCardProps[]
  isLoading?: boolean
}

export function TrendingDevicesGrid({ devices, isLoading, className, ...props }: TrendingDevicesGridProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", className)} {...props}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-surface border border-border-subtle rounded-xl h-[400px] w-full" />
        ))}
      </div>
    )
  }

  if (devices.length === 0) {
    return (
      <div className="w-full py-12 text-center border border-border-subtle border-dashed rounded-xl text-text-secondary bg-surface/50">
        No trending devices currently available.
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", className)} {...props}>
      {devices.map((device) => (
        <DeviceCard key={device.id} {...device} />
      ))}
    </div>
  )
}
