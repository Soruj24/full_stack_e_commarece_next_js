"use client";

import { memo } from "react";
import Image from "next/image";
import { useLocalization } from "@/modules/common/hooks/LocalizationContext";
import { formatPrice } from "@/lib/localization";
import type { CartItem as CartItemType } from "@/modules/cart/context/CartContext";

interface ReviewItemListProps {
  items: CartItemType[];
}

export const ReviewItemList = memo(function ReviewItemList({ items }: ReviewItemListProps) {
  const { currency } = useLocalization();

  return (
    <div className="space-y-4">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Items ({items.length})
      </span>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background shrink-0">
            <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {item.quantity}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.name}</p>
            <p className="text-sm text-muted-foreground">{formatPrice(item.price, currency)} each</p>
          </div>
          <p className="font-bold">{formatPrice(item.price * item.quantity, currency)}</p>
        </div>
      ))}
    </div>
  );
});
