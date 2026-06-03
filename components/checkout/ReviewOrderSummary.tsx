"use client";

import { useLocalization } from "@/context/LocalizationContext";
import { formatPrice } from "@/lib/localization";

interface ReviewOrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
}

export function ReviewOrderSummary({ subtotal, shippingCost, tax, discount, total }: ReviewOrderSummaryProps) {
  const { currency } = useLocalization();

  return (
    <div className="border-t border-border pt-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatPrice(subtotal, currency)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingCost, currency)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tax</span>
        <span>{formatPrice(tax, currency)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-{formatPrice(discount, currency)}</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
        <span>Total</span>
        <span className="text-primary">{formatPrice(total, currency)}</span>
      </div>
    </div>
  );
}
