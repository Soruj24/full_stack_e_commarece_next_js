import { useState } from "react";
import { toast } from "sonner";

export function useStockCounter(stock: number, lowStockThreshold: number, productId?: string, productName?: string) {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showNotifyForm, setShowNotifyForm] = useState(false);

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= lowStockThreshold;
  const isGoodStock = stock > lowStockThreshold;

  const getStockStatus = () => {
    if (isOutOfStock) return {
      label: "Out of Stock", description: "This item is currently unavailable",
      color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-500/10",
      borderColor: "border-red-200 dark:border-red-500/30", dotColor: "bg-red-500",
    };
    if (isLowStock) return {
      label: `Only ${stock} left!`, description: "Hurry, selling fast!",
      color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-500/10",
      borderColor: "border-orange-200 dark:border-orange-500/30", dotColor: "bg-orange-500",
    };
    return {
      label: "In Stock", description: `${stock} items available`,
      color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-500/10",
      borderColor: "border-green-200 dark:border-green-500/30", dotColor: "bg-green-500",
    };
  };

  const handleNotifySubmit = async () => {
    if (!notifyEmail || !notifyEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const res = await fetch("/api/stock-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email: notifyEmail, productName }),
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

  return {
    status: getStockStatus(),
    isOutOfStock, isLowStock, isGoodStock,
    notifyEmail, setNotifyEmail, isSubscribed, showNotifyForm, setShowNotifyForm,
    handleNotifySubmit,
  };
}
