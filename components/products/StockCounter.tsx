"use client";

import { useStockCounter } from "@/hooks/use-stock-counter";
import { StockBadge } from "./stock-counter/StockBadge";
import { StockMinimal } from "./stock-counter/StockMinimal";
import { StockBar } from "./stock-counter/StockBar";
import { StockDefault } from "./stock-counter/StockDefault";

interface StockCounterProps {
  stock: number;
  lowStockThreshold?: number;
  productId?: string;
  productName?: string;
  showNotifyButton?: boolean;
  variant?: "default" | "minimal" | "bar" | "badge";
  className?: string;
}

export function StockCounter({ stock, lowStockThreshold = 10, productId, productName, showNotifyButton = true, variant = "default", className }: StockCounterProps) {
  const { status, isOutOfStock, isLowStock, isGoodStock, notifyEmail, setNotifyEmail, isSubscribed, showNotifyForm, setShowNotifyForm, handleNotifySubmit } = useStockCounter(stock, lowStockThreshold, productId, productName);

  if (variant === "badge") return <StockBadge status={status} className={className} />;
  if (variant === "minimal") return <StockMinimal status={status} className={className} />;
  if (variant === "bar") return <StockBar stock={stock} isOutOfStock={isOutOfStock} isLowStock={isLowStock} isGoodStock={isGoodStock} lowStockThreshold={lowStockThreshold} status={status} className={className} />;

  return (
    <StockDefault
      stock={stock} lowStockThreshold={lowStockThreshold} status={status}
      isOutOfStock={isOutOfStock} isLowStock={isLowStock} showNotifyButton={showNotifyButton}
      notifyEmail={notifyEmail} setNotifyEmail={setNotifyEmail}
      isSubscribed={isSubscribed} showNotifyForm={showNotifyForm}
      setShowNotifyForm={setShowNotifyForm} handleNotifySubmit={handleNotifySubmit}
      className={className}
    />
  );
}
