"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  disabled?: boolean
  size?: "sm" | "md"
  className?: string
  ariaLabel?: string
}

export function QuantitySelector({
  value,
  min = 1,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  onChange,
  disabled = false,
  size = "md",
  className,
  ariaLabel = "Quantity",
}: QuantitySelectorProps) {
  const dec = () => onChange(Math.max(min, value - step))
  const inc = () => onChange(Math.min(max, value + step))
  const btnSize = size === "sm" ? "h-8 w-8" : "h-10 w-10"
  const textSize = size === "sm" ? "w-8 text-sm" : "w-10 text-sm"

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-border/60 bg-background/70 p-1 shadow-xs",
        disabled && "opacity-60",
        className
      )}
      role="group"
      aria-label={ariaLabel}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(btnSize, "rounded-lg")}
        onClick={dec}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className={cn("text-center font-medium tabular-nums text-foreground", textSize)} aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(btnSize, "rounded-lg")}
        onClick={inc}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
