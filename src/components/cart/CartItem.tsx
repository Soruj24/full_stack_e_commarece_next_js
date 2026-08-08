"use client";

import Image from "next/image";
import { Trash2, Plus, Minus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSafeImageSrc } from "@/lib/utils";
import { useSaveForLater } from "@/modules/cart/context/SaveForLaterContext";
import { CartItem as CartItemType } from "@/modules/cart/context/CartContext";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { addToSaveForLater, isSaved } = useSaveForLater();
  const saved = isSaved(item.id);

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

  const lowStock = item.stock <= 10 && item.stock > 0;

  return (
    <div className="group relative p-6 rounded-2xl bg-card border border-border/30 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-center gap-6">
        {/* Product Image */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-muted/30 border border-border/20 shrink-0">
          <Image
            src={getSafeImageSrc(item.image)}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 96px, 128px"
          />
          {item.isBundle && (
            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded-md">
              Bundle
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                ${item.price.toFixed(2)} each
              </p>
            </div>

            {/* Price */}
            <div className="text-right shrink-0">
              <p className="font-black text-lg md:text-xl tracking-tight">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border/30">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-background"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-background"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-1.5">
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

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg transition-colors",
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
                className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
