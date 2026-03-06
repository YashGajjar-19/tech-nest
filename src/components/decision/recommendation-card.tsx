import * as React from "react"
import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface RecommendationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  deviceId: string
  deviceName: string
  reasoning: string
  badgeText?: string
  imageUrl?: string
}

export function RecommendationCard({
  deviceId,
  deviceName,
  reasoning,
  badgeText = "Recommended",
  imageUrl,
  className,
  ...props
}: RecommendationCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-accent/20 bg-linear-to-b from-surface to-bg-secondary w-full", className)} {...props}>
      {/* Decorative AI Glow */}
      <div className="absolute top-0 right-0 p-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {badgeText}
          </span>
        </div>
        <CardTitle className="text-2xl">{deviceName}</CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
        {imageUrl && (
          <div className="w-24 h-24 shrink-0 rounded-lg bg-white/5 border border-border-subtle flex items-center justify-center p-2">
            <img src={imageUrl} alt={deviceName} className="object-contain w-full h-full drop-shadow-lg" />
          </div>
        )}
        <p className="text-text-secondary leading-relaxed text-sm flex-1">
          {reasoning}
        </p>
      </CardContent>

      <CardFooter className="relative z-10 border-t border-border-subtle/30 pt-4 mt-2">
        <Button variant="ghost" className="w-full justify-between hover:bg-accent/10 hover:text-accent font-medium" asChild>
          <Link href={`/device/${deviceId}`}>
            View Full Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
