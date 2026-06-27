"use client";

import { Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { StockStatusBadge, BackInStockAlert } from "@/components/products/StockStatus";

interface Props {
  stock: number;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void;
  isInWishlist: boolean;
  onToggleWishlist: () => void;
  productId: string;
  productName: string;
  productImage?: string;
}

export function ProductCartActions({
  stock, quantity, onQuantityChange, onAddToCart,
  isInWishlist, onToggleWishlist, productId, productName, productImage,
}: Props) {
  return (
    <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-2xl shadow-primary/5 space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Quantity</Label>
          <StockStatusBadge stock={stock} variant="badge" showIcon={false} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-muted/50 p-1.5 rounded-2xl border border-border/50">
            <Button size="icon" variant="ghost" className="rounded-xl hover:bg-background h-10 w-10"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))} disabled={stock === 0}>
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-black text-lg">{quantity}</span>
            <Button size="icon" variant="ghost" className="rounded-xl hover:bg-background h-10 w-10"
              onClick={() => onQuantityChange(Math.min(stock, quantity + 1))} disabled={stock === 0}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Button className="flex-1 rounded-2xl h-[52px] font-black text-sm gap-3 shadow-xl shadow-primary/20"
            disabled={stock === 0} onClick={onAddToCart}>
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline"
          className={cn("flex-1 rounded-2xl h-[52px] font-black text-sm gap-2 border-border/50 transition-colors",
            isInWishlist && "bg-red-50 text-red-500 border-red-200 hover:bg-red-100")}
          onClick={onToggleWishlist}>
          <Heart className={cn("w-5 h-5", isInWishlist && "fill-current")} />
          {isInWishlist ? "In Wishlist" : "Wishlist"}
        </Button>
      </div>

      {stock === 0 && (
        <BackInStockAlert productId={productId} productName={productName} productImage={productImage} variant="card" />
      )}
    </div>
  );
}
