"use client";

import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface ReturnItemListProps {
  items: OrderItem[];
  selectedItems: OrderItem[];
  toggleItem: (item: OrderItem) => void;
}

export function ReturnItemList({ items, selectedItems, toggleItem }: ReturnItemListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.productId}
          className={`flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer ${
            selectedItems.find((i) => i.productId === item.productId)
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => toggleItem(item)}
        >
          <Checkbox
            checked={!!selectedItems.find((i) => i.productId === item.productId)}
            onCheckedChange={() => toggleItem(item)}
          />
          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
            <Image src={item.image || "/placeholder.png"} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="font-medium line-clamp-1">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              Qty: {item.quantity} | ${item.price.toFixed(2)}
            </p>
          </div>
          <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
