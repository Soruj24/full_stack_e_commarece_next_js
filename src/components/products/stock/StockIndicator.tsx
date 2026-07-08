"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useStock } from "@/modules/cart/context/StockContext";

interface StockIndicatorProps {
  stock: number;
  preOrder?: boolean;
  className?: string;
}

export function StockIndicator({ stock, preOrder, className }: StockIndicatorProps) {
  const { checkStockStatus } = useStock();
  const status = checkStockStatus(stock, preOrder);

  const config = {
    in_stock: { ping: "bg-green-400", dot: "bg-green-500", text: "text-green-600", label: "Available" },
    low_stock: { ping: "bg-orange-400", dot: "bg-orange-500", text: "text-orange-600", label: `Selling Fast - Only ${stock} left!` },
    out_of_stock: { ping: "", dot: "bg-red-500", text: "text-red-600", label: "Out of Stock" },
    pre_order: { ping: "bg-blue-400", dot: "bg-blue-500", text: "text-blue-600", label: "Pre-order Available" },
  };

  const c = config[status];
  const showPing = status !== "out_of_stock" && c.ping;

  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={cn("flex items-center gap-1.5", className)}>
      <span className="relative flex h-2.5 w-2.5">
        {showPing && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", c.ping)} />
        )}
        <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", c.dot)} />
      </span>
      <span className={cn("text-xs font-medium", c.text)}>{c.label}</span>
    </motion.div>
  );
}
