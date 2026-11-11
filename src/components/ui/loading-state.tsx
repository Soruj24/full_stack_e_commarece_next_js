import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  description?: string
  variant?: "spinner" | "skeleton" | "inline"
}

function LoadingState({
  label = "Loading",
  description,
  variant = "spinner",
  className,
  children,
  ...props
}: LoadingStateProps) {
  if (variant === "inline") {
    return (
      <div
        data-slot="loading-state"
        className={cn("flex items-center gap-3 text-sm text-muted-foreground", className)}
        role="status"
        aria-live="polite"
        {...props}
      >
        <LoadingSpinner size="sm" />
        <span>{label}</span>
        {children}
      </div>
    )
  }

  if (variant === "skeleton") {
    return (
      <div
        data-slot="loading-state"
        className={cn("space-y-4", className)}
        role="status"
        aria-live="polite"
        aria-label={label}
        {...props}
      >
        {children ?? (
          <>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </>
        )}
      </div>
    )
  }

  return (
    <div
      data-slot="loading-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-surface/40 px-6 py-12 text-center",
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      <LoadingSpinner size="lg" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  )
}

function LoadingOverlay({ label = "Loading...", className }: { label?: string; className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/70 backdrop-blur-sm",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-lg">
        <LoadingSpinner size="sm" />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
    </div>
  )
}

export { LoadingState, LoadingOverlay }
