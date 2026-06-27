"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReorderButton } from "./ReorderButton";

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock?: number;
}

interface ReorderCardProps {
  orderId: string;
  items: OrderItem[];
  onReorderComplete?: () => void;
}

export function ReorderCard({ orderId, items, onReorderComplete }: ReorderCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Order #{orderId.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-zinc-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="text-xs">
          {expanded ? "Hide items" : "Show items"}
        </Button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-white/5 rounded-xl">
                  <img src={item.image || "/placeholder.png"} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-zinc-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-white/10">
              <ReorderButton orderId={orderId} items={items} onReorderComplete={onReorderComplete} variant="default" size="default" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && (
        <div className="p-4">
          <ReorderButton orderId={orderId} items={items} onReorderComplete={onReorderComplete} variant="default" size="default" />
        </div>
      )}
    </div>
  );
}
