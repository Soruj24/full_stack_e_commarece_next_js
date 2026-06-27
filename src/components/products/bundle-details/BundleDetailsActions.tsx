"use client";

import { Plus, Minus, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BundleDetailsActionsProps {
  quantity: number;
  maxQuantity: number;
  bundlePrice: number;
  isOutOfStock: boolean;
  inCart: boolean;
  isAdding: boolean;
  justAdded: boolean;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
}

export function BundleDetailsActions({
  quantity,
  maxQuantity,
  bundlePrice,
  isOutOfStock,
  inCart,
  isAdding,
  justAdded,
  onQuantityChange,
  onAddToCart,
}: BundleDetailsActionsProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-bold">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(Math.min(maxQuantity || 10, quantity + 1))}
            disabled={quantity >= (maxQuantity || 10)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Max: {maxQuantity || 10} per order
        </span>
      </div>

      <Button
        onClick={onAddToCart}
        disabled={isAdding || isOutOfStock || inCart}
        className={cn(
          "w-full h-14 text-lg font-bold rounded-xl",
          justAdded && "bg-green-500 hover:bg-green-500"
        )}
      >
        {inCart ? (
          <>
            <CheckCircle2 className="w-6 h-6 mr-2" />
            Already in Cart
          </>
        ) : justAdded ? (
          <>
            <CheckCircle2 className="w-6 h-6 mr-2" />
            Added to Cart!
          </>
        ) : isAdding ? (
          "Adding to Cart..."
        ) : isOutOfStock ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingCart className="w-6 h-6 mr-2" />
            Add Bundle to Cart - ${(bundlePrice * quantity).toFixed(2)}
          </>
        )}
      </Button>
    </>
  );
}
