"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

interface ShippingProgressBarProps {
  subtotal: number;
  shippingThreshold: number;
  shippingProgress: number;
  remainingForFreeShipping: number;
}

export function ShippingProgressBar({ subtotal, shippingThreshold, shippingProgress, remainingForFreeShipping }: ShippingProgressBarProps) {
  if (subtotal <= 0 || subtotal >= shippingThreshold) return null;

  return (
    <div className="px-6 py-3 bg-primary/5 border-b border-primary/10">
      <div className="flex items-center gap-2 mb-2">
        <Truck className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-primary">
          {remainingForFreeShipping > 0
            ? `$${remainingForFreeShipping.toFixed(2)} away from free shipping`
            : "You've unlocked free shipping!"}
        </span>
      </div>
      <div className="h-1.5 bg-primary/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${shippingProgress}%` }}
          className="h-full bg-primary rounded-full"
        />
      </div>
    </div>
  );
}
