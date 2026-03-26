"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number
  variant?: "default" | "success" | "warning" | "destructive"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

function Progress({
  className,
  value,
  variant = "default",
  size = "md",
  showLabel = false,
  ...props
}: ProgressProps) {
  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-orange-500",
    destructive: "bg-red-500",
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-sm">
          <span className="text-muted-foreground font-medium">Progress</span>
          <span className="text-foreground font-semibold">{Math.round(value || 0)}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "bg-muted relative w-full overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
}

export { Progress }
