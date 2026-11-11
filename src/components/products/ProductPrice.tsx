"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ProductPriceProps {
  price: number
  compareAtPrice?: number | null
  discountPrice?: number | null
  currency?: string
  locale?: string
  size?: "sm" | "md" | "lg"
  className?: string
  showBadge?: boolean
}

function formatMoney(value: number, currency = "USD", locale = "en-US") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value)
  } catch {
    return `$${value.toFixed(2)}`
  }
}

export function ProductPrice({
  price,
  compareAtPrice,
  discountPrice,
  currency = "USD",
  locale = "en-US",
  size = "md",
  className,
  showBadge = true,
}: ProductPriceProps) {
  const effectiveCompare = compareAtPrice && compareAtPrice > 0 ? compareAtPrice : price
  const effectivePrice =
    discountPrice && discountPrice > 0 && discountPrice < effectiveCompare ? discountPrice : price
  const hasDiscount = effectiveCompare > effectivePrice
  const percent = hasDiscount ? Math.round(((effectiveCompare - effectivePrice) / effectiveCompare) * 100) : 0

  const sizeClasses = {
    sm: { current: "text-sm font-semibold", original: "text-xs" },
    md: { current: "text-lg font-semibold tracking-tight", original: "text-sm" },
    lg: { current: "text-2xl sm:text-3xl font-semibold tracking-tight", original: "text-base" },
  } as const

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("text-foreground", sizeClasses[size].current)}>
        {formatMoney(effectivePrice, currency, locale)}
      </span>
      {hasDiscount && (
        <>
          <span className={cn("text-muted-foreground line-through", sizeClasses[size].original)}>
            {formatMoney(effectiveCompare, currency, locale)}
          </span>
          {showBadge && percent > 0 && (
            <Badge variant="success" size="sm" className="font-semibold">
              -{percent}%
            </Badge>
          )}
        </>
      )}
    </div>
  )
}
