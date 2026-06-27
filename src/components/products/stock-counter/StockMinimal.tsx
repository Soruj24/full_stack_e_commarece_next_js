"use client";

import { cn } from "@/lib/utils";

interface StockMinimalProps {
  status: { color: string; label: string; dotColor: string };
  className?: string;
}

export function StockMinimal({ status, className }: StockMinimalProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-2 h-2 rounded-full", status.dotColor)} />
      <span className={cn("text-sm font-medium", status.color)}>{status.label}</span>
    </div>
  );
}
