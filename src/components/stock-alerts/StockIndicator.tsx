"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface StockIndicatorProps {
  stock: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StockIndicator({ stock, showLabel = true, size = "md" }: StockIndicatorProps) {
  const getStockStatus = () => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200",
        dotColor: "bg-red-500",
      };
    }
    if (stock <= 3) {
      return {
        label: `Only ${stock} left!`,
        color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200",
        dotColor: "bg-orange-500",
      };
    }
    if (stock <= 10) {
      return {
        label: `Low stock: ${stock} left`,
        color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200",
        dotColor: "bg-yellow-500",
      };
    }
    return null;
  };

  const status = getStockStatus();

  if (!status || stock > 10) {
    return null;
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        status.color,
        sizeClasses[size]
      )}
    >
      <span className={cn("rounded-full", status.dotColor, dotSizes[size])} />
      {showLabel && <span>{status.label}</span>}
      {stock === 0 && <AlertTriangle className="w-3 h-3" />}
    </div>
  );
}
