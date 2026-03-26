"use client";

import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSafeImageSrc } from "@/lib/utils";
import { StockStatusBadge } from "@/components/products/StockStatus";
import { CartItem as CartItemType } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  return (
    <div className="group flex flex-col sm:flex-row items-center gap-8 p-8 rounded-[40px] bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
      <div className="relative w-32 h-32 rounded-[32px] overflow-hidden bg-muted border border-border/50 shrink-0">
        <Image
          src={getSafeImageSrc(item.image)}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-product.svg";
          }}
        />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-black text-xl line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {item.isBundle ? "Bundle Deal" : "Premium Quality"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="rounded-xl hover:bg-destructive/10 hover:text-destructive shrink-0"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-muted/50 p-1 rounded-2xl border border-border/50">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-10 text-center font-black">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <StockStatusBadge stock={item.stock} variant="badge" />
          </div>
          <p className="text-2xl font-black tracking-tight">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}