"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductRatingProps {
  rating?: number
  count?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  showCount?: boolean
  className?: string
}

export function ProductRating({
  rating = 0,
  count = 0,
  size = "md",
  showValue = true,
  showCount = true,
  className,
}: ProductRatingProps) {
  const clamped = Math.max(0, Math.min(5, rating))
  const full = Math.floor(clamped)
  const hasHalf = clamped - full >= 0.5
  const starSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4"

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)} aria-label={`Rated ${clamped} out of 5`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && hasHalf)
          return (
            <Star
              key={i}
              className={cn(
                starSize,
                "transition-colors",
                filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-border"
              )}
              aria-hidden="true"
            />
          )
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-foreground">{clamped.toFixed(1)}</span>}
      {showCount && <span className="text-sm text-muted-foreground">({count})</span>}
    </div>
  )
}
