"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import type { CartItem } from "@/features/cart/context/CartContext";

interface CartItemRowProps {
  item: CartItem;
  removingId: string | null;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onMoveToWishlist: (item: CartItem) => void;
}

export function CartItemRow({ item, removingId, onQuantityChange, onRemove, onMoveToWishlist }: CartItemRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`flex gap-4 p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl transition-opacity ${
        removingId === item.id ? "opacity-50" : ""
      }`}
    >
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
        <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
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
            className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="flex items-center gap-2">
            <button onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
            <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="w-7 h-7 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 flex items-center justify-center hover:border-primary transition-colors">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="text-right">
            <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        <button onClick={() => onMoveToWishlist(item)}
          className="flex items-center gap-1 mt-2 text-[11px] text-zinc-400 hover:text-primary transition-colors">
          <Heart className="w-3 h-3" />
          Move to wishlist
        </button>
      </div>
    </motion.div>
  );
}
