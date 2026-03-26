"use client";

import { ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSaveForLater } from "@/context/SaveForLaterContext";

interface CartEmptyStateProps {
  savedItemsCount: number;
}

export function CartEmptyState({ savedItemsCount }: CartEmptyStateProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
          <ShoppingBag className="w-16 h-16 text-primary/20" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary/20">
          0
        </div>
      </div>
      <div className="space-y-3 max-w-sm">
        <h2 className="text-4xl font-black tracking-tighter">
          Your Cart is <span className="text-primary">Empty</span>
        </h2>
        <p className="text-muted-foreground font-medium">
          Looks like you haven&apos;t added anything to your cart yet. Start
          exploring our premium collection.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button
            variant="default"
            className="rounded-2xl px-8 h-14 font-black text-lg shadow-2xl shadow-primary/20 gap-3"
          >
            Explore Products <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        {savedItemsCount > 0 && (
          <Link href="/saved">
            <Button
              variant="outline"
              className="rounded-2xl px-8 h-14 font-black gap-3"
            >
              <Heart className="w-5 h-5" />
              Saved ({savedItemsCount})
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}