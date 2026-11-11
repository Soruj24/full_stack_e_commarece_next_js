"use client";

import Image from "next/image";
import { Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSafeImageSrc } from "@/lib/utils";
import { useSaveForLater } from "@/modules/cart/context/SaveForLaterContext";
import { CartItem as CartItemType } from "@/modules/cart/context/CartContext";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { QuantitySelector } from "@/components/products/QuantitySelector";

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
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 10 && Math.abs(dx) > dy) {
      setIsSwiping(true);
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
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 flex items-center justify-end pr-4 bg-destructive rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveForLater}
            disabled={saved}
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-full transition-colors",
              saved ? "bg-white/20 text-white/40" : "bg-white/20 text-white hover:bg-white/30"
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

      <div
        className={cn(
          "relative p-4 sm:p-6 rounded-2xl bg-card border border-border/50 transition-all duration-300",
          isSwiping ? "transition-none" : "transition-transform duration-300 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)] hover:border-border"
        )}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-surface border border-border/40 shrink-0">
            <Image
              src={getSafeImageSrc(item.image)}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
            />
            {item.isBundle && (
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-semibold uppercase tracking-wider rounded-md">
                Bundle
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-1 text-foreground">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  ${item.price.toFixed(2)} each
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-base sm:text-lg md:text-xl tracking-tight text-foreground">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <QuantitySelector
                  value={item.quantity}
                  min={1}
                  max={item.stock}
                  onChange={(q) => onUpdateQuantity(item.id, q)}
                />

                <div className="hidden sm:flex items-center gap-1.5">
                  {item.stock === 0 ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-destructive">Out of stock</span>
                  ) : lowStock ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-warning-foreground dark:text-warning">
                      Only {item.stock} left
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-success">In stock</span>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-11 w-11 rounded-xl transition-colors",
                    saved
                      ? "text-muted-foreground/30 cursor-not-allowed"
                      : "hover:bg-destructive/10 hover:text-destructive"
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
                  className="h-11 w-11 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="sm:hidden">
              {item.stock === 0 ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-destructive">Out of stock</span>
              ) : lowStock ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-warning-foreground dark:text-warning">
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
