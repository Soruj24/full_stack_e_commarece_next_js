"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useStock } from "@/modules/cart/context/StockContext";

interface StockStatusBadgeProps {
  stock: number;
  preOrder?: boolean;
  variant?: "badge" | "text" | "bar" | "progress";
  showIcon?: boolean;
  className?: string;
}

const icons = {
  in_stock: CheckCircle2,
  low_stock: AlertCircle,
  out_of_stock: XCircle,
  pre_order: Clock,
};

const badgeStyles = {
  in_stock: "bg-green-100 text-green-700 border-green-200",
  low_stock: "bg-orange-100 text-orange-700 border-orange-200",
  out_of_stock: "bg-red-100 text-red-700 border-red-200",
  pre_order: "bg-blue-100 text-blue-700 border-blue-200",
};

export function StockStatusBadge({ stock, preOrder = false, variant = "badge", showIcon = true, className }: StockStatusBadgeProps) {
  const { checkStockStatus, getStockLabel, getStockColor } = useStock();
  const status = checkStockStatus(stock, preOrder);
  const label = getStockLabel(stock, preOrder);
  const colorClass = getStockColor(stock, preOrder);
  const Icon = icons[status];

  if (variant === "text") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {showIcon && <Icon className={cn("w-4 h-4", colorClass)} />}
        <span className={cn("font-medium", colorClass)}>{label}</span>
      </div>
    );
  }

  if (variant === "bar") {
    const percentage = preOrder ? 100 : Math.min((stock / 20) * 100, 100);
    const barColor = status === "in_stock" ? "bg-green-500"
      : status === "low_stock" ? "bg-orange-500"
      : status === "out_of_stock" ? "bg-red-500" : "bg-blue-500";

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-sm">
          <span className={cn("font-medium flex items-center gap-1.5", colorClass)}>
            {showIcon && <Icon className="w-4 h-4" />}
            {label}
          </span>
          {!preOrder && status !== "out_of_stock" && (
            <span className="text-muted-foreground">{stock} units</span>
          )}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn("h-full rounded-full", barColor)}
          />
        </div>
      </div>
    );
  }

  if (variant === "progress") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className={cn("relative w-12 h-12", colorClass)}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted opacity-20" />
            <motion.circle
              cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3"
              strokeDasharray={`${preOrder ? 100 : Math.min(stock / 20 * 100, 100)} 100`}
              className={cn(
                status === "in_stock" ? "text-green-500" : status === "low_stock" ? "text-orange-500"
                  : status === "out_of_stock" ? "text-red-500" : "text-blue-500",
              )}
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${preOrder ? 100 : Math.min(stock / 20 * 100, 100)} 100` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {showIcon && <Icon className="w-5 h-5" />}
          </div>
        </div>
        <div>
          <p className={cn("font-semibold", colorClass)}>{label}</p>
          {!preOrder && status !== "out_of_stock" && (
            <p className="text-xs text-muted-foreground">{stock} available</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Badge variant="outline" className={cn("font-medium px-2.5 py-1 rounded-full gap-1.5", badgeStyles[status], className)}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </Badge>
  );
}
