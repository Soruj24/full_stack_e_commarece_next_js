"use client";

import { IOrder } from "@/types";

interface OrderSummaryProps {
  order: IOrder;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="flex flex-col items-end space-y-3">
      <div className="flex justify-between w-full max-w-xs text-sm font-medium">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-black">
          $
          {(
            order.totalAmount -
            order.shippingPrice -
            order.taxPrice
          ).toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between w-full max-w-xs text-sm font-medium">
        <span className="text-muted-foreground">Shipping</span>
        <span className="font-black">
          ${order.shippingPrice.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between w-full max-w-xs text-sm font-medium">
        <span className="text-muted-foreground">Tax</span>
        <span className="font-black">${order.taxPrice.toFixed(2)}</span>
      </div>
      <div className="flex justify-between w-full max-w-xs pt-4 border-t border-border/50">
        <span className="text-lg font-black tracking-tight">
          Grand Total
        </span>
        <span className="text-3xl font-black tracking-tighter text-primary">
          ${order.totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}