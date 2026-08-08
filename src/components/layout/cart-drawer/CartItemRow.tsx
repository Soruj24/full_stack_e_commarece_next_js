"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import type { CartItem } from "@/modules/cart/context/CartContext";

interface CartItemRowProps {
  item: CartItem;
  removingId: string | null;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onMoveToWishlist: (item: CartItem) => void;
}

export const CartItemRow = memo(function CartItemRow({ item, removingId, onQuantityChange, onRemove, onMoveToWishlist }: CartItemRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`flex gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-2xl transition-opacity ${
        removingId === item.id ? "opacity-50" : ""
      }`}
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-background shrink-0">
        <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" sizes="80px" />
        {item.isBundle && (
          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary text-[9px] font-bold text-white rounded">Bundle</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <h4 className="font-semibold text-sm line-clamp-2 mb-1">{item.name}</h4>
            {item.isBundle && (
              <p className="text-[10px] text-primary">Bundle ({item.bundleProducts?.length || 0} items)</p>
            )}
          </div>
          <button onClick={() => onRemove(item.id)}
            className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors tap-target">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="flex items-center gap-1">
            <button onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed tap-target">
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
            <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary transition-colors tap-target">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="text-right">
            <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        <button onClick={() => onMoveToWishlist(item)}
          className="flex items-center gap-1 mt-2 text-[11px] text-muted-foreground hover:text-primary transition-colors tap-target py-1">
          <Heart className="w-3 h-3" />
          Move to wishlist
        </button>
      </div>
    </motion.div>
  );
});
