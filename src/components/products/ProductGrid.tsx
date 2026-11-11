"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4 | 5
  gap?: "sm" | "md" | "lg"
}

const columnClasses: Record<NonNullable<ProductGridProps["columns"]>, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
}

const gapClasses: Record<NonNullable<ProductGridProps["gap"]>, string> = {
  sm: "gap-3 sm:gap-4",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
}

export function ProductGrid({
  columns = 4,
  gap = "md",
  className,
  children,
  ...props
}: ProductGridProps) {
  return (
    <div
      data-slot="product-grid"
      className={cn("grid", columnClasses[columns], gapClasses[gap], className)}
      {...props}
    >
      {children}
    </div>
  )
}
