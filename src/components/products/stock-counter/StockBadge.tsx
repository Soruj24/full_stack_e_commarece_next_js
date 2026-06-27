"use client";

import { cn } from "@/lib/utils";

interface StockBadgeProps {
  status: { color: string; label: string; dotColor: string };
  className?: string;
}

export function StockBadge({ status, className }: StockBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("w-2 h-2 rounded-full", status.dotColor)} />
      <span className={cn("text-sm font-medium", status.color)}>{status.label}</span>
    </div>
  );
}
