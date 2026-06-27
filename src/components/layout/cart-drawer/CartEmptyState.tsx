"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartEmptyStateProps {
  onClose: () => void;
}

export function CartEmptyState({ onClose }: CartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center mb-6">
        <ShoppingBag className="w-10 h-10 text-zinc-300" />
      </div>
      <h3 className="text-lg font-bold mb-2">Your cart is empty</h3>
      <p className="text-sm text-zinc-500 text-center mb-6">
        Looks like you haven&apos;t added anything to your cart yet.
      </p>
      <Button onClick={onClose} className="rounded-full px-8">
        Continue Shopping
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
