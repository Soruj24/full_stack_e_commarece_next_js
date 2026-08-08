"use client";

import { ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CartEmptyStateProps {
  savedItemsCount: number;
}

export function CartEmptyState({ savedItemsCount }: CartEmptyStateProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full" />
      </div>

      <div className="space-y-8 max-w-md">
        {/* Icon */}
        <div className="relative mx-auto w-28 h-28">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 animate-pulse" />
          <div className="absolute inset-3 rounded-full bg-background border border-border/50 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-primary/30" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/30">
            0
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Your Cart is <span className="text-primary">Empty</span>
          </h2>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Looks like you haven&apos;t added anything yet. Explore our premium collection and find something you love.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/products" className="w-full sm:w-auto">
            <Button className="w-full h-12 rounded-xl font-bold text-sm gap-2 shadow-lg shadow-primary/20 group">
              Explore Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          {savedItemsCount > 0 && (
            <Link href="/saved" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-sm gap-2">
                <Heart className="w-4 h-4" />
                Saved ({savedItemsCount})
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
