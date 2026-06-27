"use client";

import { ShoppingBag, X } from "lucide-react";

interface DrawerHeaderProps {
  totalItems: number;
  onClose: () => void;
}

export function DrawerHeader({ totalItems, onClose }: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold">Your Cart ({totalItems})</h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
