"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { motion } from "framer-motion";
import { getSafeImageSrc, getFallbackImage } from "@/lib/utils";

interface OrderItemsCardProps {
  items: {
    name: string;
    image?: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}

export function OrderItemsCard({ items, totalAmount }: OrderItemsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 lg:p-8"
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        Order Items
      </h3>
      <div className="space-y-4">
        {items.slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
              <Image
                src={getSafeImageSrc(item.image)}
                alt={item.name}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFallbackImage();
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold">
              ${((item.price || 0) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-sm text-muted-foreground">
            +{items.length - 3} more items
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold text-lg">${(totalAmount || 0).toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}