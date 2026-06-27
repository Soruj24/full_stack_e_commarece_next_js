"use client";

import { motion } from "framer-motion";
import { Clock, AlertTriangle, TrendingDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotifyForm } from "./NotifyForm";

interface StockDefaultProps {
  stock: number;
  lowStockThreshold: number;
  status: {
    label: string; description: string; color: string; bgColor: string; borderColor: string; dotColor: string;
  };
  isOutOfStock: boolean;
  isLowStock: boolean;
  showNotifyButton: boolean;
  notifyEmail: string;
  setNotifyEmail: (v: string) => void;
  isSubscribed: boolean;
  showNotifyForm: boolean;
  setShowNotifyForm: (v: boolean) => void;
  handleNotifySubmit: () => void;
  className?: string;
}

export function StockDefault({ stock, lowStockThreshold, status, isOutOfStock, isLowStock, showNotifyButton, notifyEmail, setNotifyEmail, isSubscribed, showNotifyForm, setShowNotifyForm, handleNotifySubmit, className }: StockDefaultProps) {
  return (
    <div className={cn("p-4 rounded-2xl border transition-colors", status.bgColor, status.borderColor, className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", status.bgColor)}>
            {isOutOfStock ? <AlertTriangle className={cn("w-5 h-5", status.color)} /> : isLowStock ? <TrendingDown className={cn("w-5 h-5", status.color)} /> : <Package className={cn("w-5 h-5", status.color)} />}
          </div>
          <div>
            <p className={cn("font-semibold", status.color)}>{status.label}</p>
            <p className="text-xs text-muted-foreground">{status.description}</p>
          </div>
        </div>
        <NotifyForm {...{ isOutOfStock, showNotifyButton, status, notifyEmail, setNotifyEmail, isSubscribed, showNotifyForm, setShowNotifyForm, handleNotifySubmit }} />
        {isLowStock && (
          <div className="flex items-center gap-2">
            <Clock className={cn("w-4 h-4", status.color)} />
            <span className={cn("text-xs font-medium", status.color)}>Selling fast!</span>
          </div>
        )}
      </div>
      {!isOutOfStock && (
        <div className="mt-4">
          <div className="h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }}
              animate={{ width: `${Math.min((stock / (lowStockThreshold * 3)) * 100, 100)}%` }}
              className={cn("h-full rounded-full", isLowStock ? "bg-orange-500" : "bg-green-500")} />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
            <span>0</span>
            <span>{stock} available</span>
            <span>{lowStockThreshold * 3}+ stocked</span>
          </div>
        </div>
      )}
    </div>
  );
}
