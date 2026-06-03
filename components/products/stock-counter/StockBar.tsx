"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StockBarProps {
  stock: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
  isGoodStock: boolean;
  lowStockThreshold: number;
  status: { color: string; label: string };
  className?: string;
}

export function StockBar({ stock, isOutOfStock, isLowStock, isGoodStock, lowStockThreshold, status, className }: StockBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className={cn("font-medium", status.color)}>{status.label}</span>
        <span className="text-muted-foreground">{stock} / {lowStockThreshold * 3} units</span>
      </div>
      <div className="h-2 bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((stock / (lowStockThreshold * 3)) * 100, 100)}%` }}
          className={cn("h-full rounded-full", isOutOfStock && "bg-red-500", isLowStock && "bg-orange-500", isGoodStock && "bg-green-500")}
        />
      </div>
    </div>
  );
}
