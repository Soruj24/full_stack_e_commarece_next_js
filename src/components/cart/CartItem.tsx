"use client";

import Image from "next/image";
import { Trash2, Plus, Minus, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSafeImageSrc } from "@/lib/utils";
import { useSaveForLater } from "@/modules/cart/context/SaveForLaterContext";
import { CartItem as CartItemType } from "@/modules/cart/context/CartContext";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { addToSaveForLater, isSaved } = useSaveForLater();
  const saved = isSaved(item.id);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipingRef = useRef(false);

  const lowStock = item.stock <= 10 && item.stock > 0;
  const SWIPE_THRESHOLD = -80;

  const handleSaveForLater = () => {
    if (saved) return;
    addToSaveForLater({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      stock: item.stock,
    });
    onRemove(item.id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);

    if (Math.abs(dx) > 10 && Math.abs(dx) > dy) {
      swipingRef.current = true;
      setIsSwiping(true);
      // Only allow swipe left (negative direction)
      const offset = Math.min(0, dx);
      setSwipeOffset(Math.max(-120, offset));
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < SWIPE_THRESHOLD) {
      setSwipeOffset(-100);
    } else {
      setSwipeOffset(0);
    }
    setIsSwiping(false);
    swipingRef.current = false;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete reveal behind */}
      <div className="absolute inset-0 flex items-center justify-end pr-4 bg-destructive rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveForLater}
            disabled={saved}
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-full",
              saved ? "bg-white/20 text-white/40" : "bg-white/20 text-white hover:bg-white/30",
              "transition-colors"
            )}
            aria-label="Save for later"
          >
            <Heart className={cn("w-5 h-5", saved && "fill-current")} />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-destructive hover:bg-white/90 transition-colors"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main card */}
      <div
        className={cn(
          "relative p-4 sm:p-6 rounded-2xl bg-card border border-border/30 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
          isSwiping ? "transition-none" : "transition-transform duration-300"
        )}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Product Image */}
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-muted/30 border border-border/20 shrink-0">
            <Image
              src={getSafeImageSrc(item.image)}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
            />
            {item.isBundle && (
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded-md">
                Bundle
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-bold text-sm sm:text-base md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  ${item.price.toFixed(2)} each
                </p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className="font-black text-base sm:text-lg md:text-xl tracking-tight">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Quantity Controls — 44px touch targets */}
                <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border/30">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-9 sm:w-9 rounded-lg hover:bg-background"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 sm:w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-9 sm:w-9 rounded-lg hover:bg-background"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Stock Status */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {item.stock === 0 ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">Out of stock</span>
                  ) : lowStock ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      Only {item.stock} left
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">In stock</span>
                  )}
                </div>
              </div>

              {/* Desktop Actions — always visible on desktop */}
              <div className="hidden sm:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-11 w-11 rounded-lg transition-colors",
                    saved
                      ? "text-muted-foreground/30 cursor-not-allowed"
                      : "hover:bg-red-50 hover:text-red-500"
                  )}
                  onClick={handleSaveForLater}
                  disabled={saved}
                  aria-label="Save for later"
                >
                  <Heart className={cn("w-4 h-4", saved && "fill-current")} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile stock indicator */}
            <div className="sm:hidden">
              {item.stock === 0 ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">Out of stock</span>
              ) : lowStock ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Only {item.stock} left
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
