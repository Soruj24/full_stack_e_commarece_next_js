"use client";

import Image from "next/image";
import { getFallbackImage, getSafeImageSrc } from "@/lib/utils";
import { IOrder } from "@/types";

interface OrderItemsListProps {
  order: IOrder;
}

export function OrderItemsList({ order }: OrderItemsListProps) {
  return (
    <div className="px-10 pb-10 space-y-8">
      <div className="h-px bg-border/50" />
      <div className="space-y-6">
        <h4 className="font-black text-xs uppercase tracking-widest text-primary">
          Order Items
        </h4>
        <div className="space-y-4">
          {order.items.map((item, idx: number) => (
            <div key={idx} className="flex items-center gap-6 group">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted border border-border/50 shrink-0">
                <Image
                  src={getSafeImageSrc(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage();
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-black text-sm group-hover:text-primary transition-colors">
                  {item.name}
                </h5>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="font-black text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}