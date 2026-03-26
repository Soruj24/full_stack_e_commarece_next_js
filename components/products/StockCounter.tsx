"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  TrendingDown, 
  Clock, 
  Bell,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StockCounterProps {
  stock: number;
  lowStockThreshold?: number;
  productId?: string;
  productName?: string;
  showNotifyButton?: boolean;
  variant?: "default" | "minimal" | "bar" | "badge";
  className?: string;
}

export function StockCounter({
  stock,
  lowStockThreshold = 10,
  productId,
  productName,
  showNotifyButton = true,
  variant = "default",
  className,
}: StockCounterProps) {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showNotifyForm, setShowNotifyForm] = useState(false);

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= lowStockThreshold;
  const isGoodStock = stock > lowStockThreshold;

  const getStockStatus = () => {
    if (isOutOfStock) {
      return {
        label: "Out of Stock",
        description: "This item is currently unavailable",
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-500/10",
        borderColor: "border-red-200 dark:border-red-500/30",
        dotColor: "bg-red-500",
      };
    }
    if (isLowStock) {
      return {
        label: `Only ${stock} left!`,
        description: "Hurry, selling fast!",
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-500/10",
        borderColor: "border-orange-200 dark:border-orange-500/30",
        dotColor: "bg-orange-500",
      };
    }
    return {
      label: "In Stock",
      description: `${stock} items available`,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-500/10",
      borderColor: "border-green-200 dark:border-green-500/30",
      dotColor: "bg-green-500",
    };
  };

  const status = getStockStatus();

  const handleNotifySubmit = async () => {
    if (!notifyEmail || !notifyEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch("/api/stock-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email: notifyEmail,
          productName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubscribed(true);
        toast.success("You'll be notified when this item is back in stock!");
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (variant === "badge") {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <span className={cn("w-2 h-2 rounded-full", status.dotColor)} />
        <span className={cn("text-sm font-medium", status.color)}>
          {status.label}
        </span>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("w-2 h-2 rounded-full", status.dotColor)} />
        <span className={cn("text-sm font-medium", status.color)}>
          {status.label}
        </span>
      </div>
    );
  }

  if (variant === "bar") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-sm">
          <span className={cn("font-medium", status.color)}>
            {status.label}
          </span>
          <span className="text-muted-foreground">
            {stock} / {lowStockThreshold * 3} units
          </span>
        </div>
        <div className="h-2 bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((stock / (lowStockThreshold * 3)) * 100, 100)}%` }}
            className={cn(
              "h-full rounded-full",
              isOutOfStock && "bg-red-500",
              isLowStock && "bg-orange-500",
              isGoodStock && "bg-green-500"
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 rounded-2xl border transition-colors",
        status.bgColor,
        status.borderColor,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", status.bgColor)}>
            {isOutOfStock ? (
              <AlertTriangle className={cn("w-5 h-5", status.color)} />
            ) : isLowStock ? (
              <TrendingDown className={cn("w-5 h-5", status.color)} />
            ) : (
              <Package className={cn("w-5 h-5", status.color)} />
            )}
          </div>
          <div>
            <p className={cn("font-semibold", status.color)}>{status.label}</p>
            <p className="text-xs text-muted-foreground">{status.description}</p>
          </div>
        </div>

        {isOutOfStock && showNotifyButton && (
          <div className="flex items-center gap-2">
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Subscribed</span>
              </div>
            ) : showNotifyForm ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="h-9 px-3 rounded-lg border text-sm w-40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" onClick={handleNotifySubmit} className="h-9">
                  Notify
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNotifyForm(false)}
                  className="h-9"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNotifyForm(true)}
                className={cn("gap-1", status.borderColor)}
              >
                <Bell className="w-4 h-4" />
                Notify Me
              </Button>
            )}
          </div>
        )}

        {isLowStock && (
          <div className="flex items-center gap-2">
            <Clock className={cn("w-4 h-4", status.color)} />
            <span className={cn("text-xs font-medium", status.color)}>
              Selling fast!
            </span>
          </div>
        )}
      </div>

      {/* Stock Progress Bar */}
      {!isOutOfStock && (
        <div className="mt-4">
          <div className="h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((stock / (lowStockThreshold * 3)) * 100, 100)}%`,
              }}
              className={cn(
                "h-full rounded-full",
                isLowStock ? "bg-orange-500" : "bg-green-500"
              )}
            />
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
