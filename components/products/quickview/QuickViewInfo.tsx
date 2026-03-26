"use client";

import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/localization";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types";
import { useWishlist } from "@/context/WishlistContext";

interface QuickViewInfoProps {
  product: IProduct;
  quantity: number;
  setQuantity: (q: number) => void;
  handleAddToCart: () => void;
  isAdding: boolean;
  currency: string;
}

export function QuickViewInfo({
  product,
  quantity,
  setQuantity,
  handleAddToCart,
  isAdding,
  currency,
}: QuickViewInfoProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const categoryName =
    typeof product.category === "object" &&
    product.category !== null &&
    "name" in product.category
      ? (product.category as { name: string }).name
      : product.category || "Uncategorized";

  return (
    <div className="p-8 sm:p-12 flex flex-col justify-between bg-card/50">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {categoryName}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
            {product.name}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-black italic">
                {product.rating || 5.0}
              </span>
            </div>
            <div className="h-4 w-px bg-border/40" />
            <span className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
              {product.numReviews || 0} Verifications
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-black tracking-tighter text-foreground italic">
            {formatPrice(product.price, currency)}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {product.description ||
              "High-performance specialized asset optimized for professional environments and mission-critical operations."}
          </p>
        </div>

        <div className="space-y-6 pt-6 border-t border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Allocation Volume
            </span>
            <div className="flex items-center bg-muted/30 rounded-2xl p-1 border border-border/40">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 rounded-xl hover:bg-background"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-black italic">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10 rounded-xl hover:bg-background"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-border/40">
              <Truck className="w-5 h-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                  Logistics
                </span>
                <span className="text-[10px] font-bold">Express Delivery</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-border/40">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                  Security
                </span>
                <span className="text-[10px] font-bold">2-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-12">
        <div className="flex gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="flex-1 h-20 rounded-[24px] bg-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-700 hover:scale-[1.02] group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
              {isAdding ? (
                <>
                  Processing Protocol{" "}
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                </>
              ) : (
                <>
                  Authorize Procurement{" "}
                  <ShoppingCart className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <Button
            variant="outline"
            onClick={() => toggleWishlist(product._id)}
            className={cn(
              "h-20 w-20 rounded-[24px] border-border/40 hover:bg-muted/50 transition-all duration-500 flex items-center justify-center",
              isInWishlist(product._id) &&
                "bg-red-500/10 text-red-500 border-red-500/20",
            )}
          >
            <Heart
              className={cn(
                "w-6 h-6 transition-colors",
                isInWishlist(product._id) && "fill-current",
              )}
            />
          </Button>
        </div>

        <p className="text-[9px] text-center font-black uppercase tracking-[0.3em] text-muted-foreground">
          Final settlement includes standard operational tax and duty
        </p>
      </div>
    </div>
  );
}
