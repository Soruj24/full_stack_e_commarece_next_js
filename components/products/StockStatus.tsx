"use client";

import { useState } from "react";
import { useStock, StockAlert, StockStatus } from "@/context/StockContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock,
  Bell,
  BellRing,
  TrendingUp,
  Trash2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import Link from "next/link";

interface StockStatusBadgeProps {
  stock: number;
  preOrder?: boolean;
  variant?: "badge" | "text" | "bar" | "progress";
  showIcon?: boolean;
  className?: string;
}

export function StockStatusBadge({
  stock,
  preOrder = false,
  variant = "badge",
  showIcon = true,
  className,
}: StockStatusBadgeProps) {
  const { checkStockStatus, getStockLabel, getStockColor } = useStock();
  
  const status = checkStockStatus(stock, preOrder);
  const label = getStockLabel(stock, preOrder);
  const colorClass = getStockColor(stock, preOrder);

  const icons = {
    in_stock: CheckCircle2,
    low_stock: AlertCircle,
    out_of_stock: XCircle,
    pre_order: Clock,
  };

  const Icon = icons[status];

  const badgeStyles = {
    in_stock: "bg-green-100 text-green-700 border-green-200",
    low_stock: "bg-orange-100 text-orange-700 border-orange-200",
    out_of_stock: "bg-red-100 text-red-700 border-red-200",
    pre_order: "bg-blue-100 text-blue-700 border-blue-200",
  };

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
      : status === "out_of_stock" ? "bg-red-500" 
      : "bg-blue-500";

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
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted opacity-20"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${preOrder ? 100 : Math.min(stock / 20 * 100, 100)} 100`}
              className={cn(
                status === "in_stock" ? "text-green-500" 
                  : status === "low_stock" ? "text-orange-500" 
                  : status === "out_of_stock" ? "text-red-500" 
                  : "text-blue-500"
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
    <Badge
      variant="outline"
      className={cn(
        "font-medium px-2.5 py-1 rounded-full gap-1.5",
        badgeStyles[status],
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </Badge>
  );
}

interface StockIndicatorProps {
  stock: number;
  preOrder?: boolean;
  className?: string;
}

export function StockIndicator({ stock, preOrder, className }: StockIndicatorProps) {
  const { checkStockStatus } = useStock();
  const status = checkStockStatus(stock, preOrder);

  if (status === "in_stock") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn("flex items-center gap-1.5", className)}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <span className="text-xs text-green-600 font-medium">Available</span>
      </motion.div>
    );
  }

  if (status === "low_stock") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn("flex items-center gap-1.5", className)}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
        </span>
        <span className="text-xs text-orange-600 font-medium">Selling Fast - Only {stock} left!</span>
      </motion.div>
    );
  }

  if (status === "out_of_stock") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn("flex items-center gap-1.5", className)}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span className="text-xs text-red-600 font-medium">Out of Stock</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn("flex items-center gap-1.5", className)}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
      </span>
      <span className="text-xs text-blue-600 font-medium">Pre-order Available</span>
    </motion.div>
  );
}

interface BackInStockAlertProps {
  productId: string;
  productName: string;
  productImage?: string;
  variant?: "button" | "inline" | "card";
  className?: string;
}

export function BackInStockAlert({
  productId,
  productName,
  productImage,
  variant = "button",
  className,
}: BackInStockAlertProps) {
  const { subscribeToStockAlert, unsubscribeFromStockAlert, isSubscribed } = useStock();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const isAlreadySubscribed = isSubscribed(productId);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      return;
    }
    
    setIsSubmitting(true);
    await subscribeToStockAlert(productId, productName, productImage, email);
    setEmail("");
    setShowForm(false);
    setIsSubmitting(false);
  };

  const handleUnsubscribe = () => {
    unsubscribeFromStockAlert(productId);
  };

  if (variant === "inline") {
    if (isAlreadySubscribed) {
      return (
        <div className={cn("flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200", className)}>
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-700">You&apos;ll be notified when this is back</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnsubscribe}
            className="text-green-600 hover:text-green-700 hover:bg-green-100"
          >
            Cancel
          </Button>
        </div>
      );
    }

    if (showForm) {
      return (
        <div className={cn("p-4 bg-muted/50 rounded-xl space-y-3", className)}>
          <div className="flex items-center gap-2 text-sm">
            <BellRing className="w-4 h-4 text-muted-foreground" />
            <span>Get notified when this product is back in stock</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-10 rounded-lg"
            />
            <Button
              onClick={handleSubscribe}
              disabled={isSubmitting || !email}
              size="sm"
              className="h-10"
            >
              {isSubmitting ? "..." : "Notify Me"}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowForm(true)}
        className={cn("gap-2", className)}
      >
        <Bell className="w-4 h-4" />
        Notify When Available
      </Button>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("bg-card rounded-2xl border p-6 space-y-4", className)}>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">Get Notified</h4>
            <p className="text-sm text-muted-foreground mt-1">
              This product is currently out of stock. Leave your email and we&apos;ll notify you when it&apos;s back.
            </p>
          </div>
        </div>

        {isAlreadySubscribed ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-700">You&apos;re on the list!</p>
              <p className="text-sm text-green-600">We&apos;ll email you when this is back.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnsubscribe}
              className="text-green-600"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl"
            />
            <Button
              onClick={handleSubscribe}
              disabled={isSubmitting || !email}
              className="w-full h-12 rounded-xl"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notify Me When Available
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => {
        if (isAlreadySubscribed) {
          handleUnsubscribe();
        } else {
          subscribeToStockAlert(productId, productName, productImage);
        }
      }}
      className={cn(
        "gap-2",
        isAlreadySubscribed && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
        className
      )}
    >
      {isAlreadySubscribed ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          Subscribed
        </>
      ) : (
        <>
          <Bell className="w-4 h-4" />
          Notify When Available
        </>
      )}
    </Button>
  );
}

export function StockAlertsList() {
  const { alerts, unsubscribeFromStockAlert } = useStock();

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No stock alerts yet</p>
        <p className="text-sm text-muted-foreground/70">
          Subscribe to get notified when out-of-stock items are back
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <motion.div
          key={alert.productId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-card rounded-xl border"
        >
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
            {alert.productImage ? (
              <Image
                src={getSafeImageSrc(alert.productImage)}
                alt={alert.productName}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFallbackImage();
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{alert.productName}</p>
            <p className="text-sm text-muted-foreground">
              {alert.email ? `Notifying: ${alert.email}` : "Subscribed"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => unsubscribeFromStockAlert(alert.productId)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
