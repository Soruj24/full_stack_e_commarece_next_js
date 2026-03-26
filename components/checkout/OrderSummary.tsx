"use client";

import Image from "next/image";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { useLocalization } from "@/context/LocalizationContext";
import { convertPrice, formatPrice } from "@/lib/localization";
import { getSafeImageSrc, cn } from "@/lib/utils";
import { CartItem } from "@/context/CartContext";

interface OrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  couponDiscount: number;
  shippingCost: number;
  tax: number;
  total: number;
  showOrderSummary: boolean;
  onToggle: () => void;
}

export function OrderSummary({
  cart,
  subtotal,
  couponDiscount,
  shippingCost,
  tax,
  total,
  showOrderSummary,
  onToggle,
}: OrderSummaryProps) {
  const { currency } = useLocalization();
  const discountedSubtotal = subtotal - couponDiscount;
  const totalForGateway = convertPrice(total, currency);

  return (
    <aside className="lg:w-[400px]">
      <div className="sticky top-24 bg-card rounded-3xl border border-border/50 shadow-sm p-6 space-y-6">
        <button
          onClick={onToggle}
          className="lg:hidden w-full flex items-center justify-between"
          aria-label="Toggle order summary"
        >
          <span className="font-bold">Order Summary</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">
              {formatPrice(totalForGateway, currency)}
            </span>
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                showOrderSummary && "rotate-90",
              )}
            />
          </div>
        </button>

        <div
          className={cn(
            "space-y-6",
            !showOrderSummary && "hidden lg:block",
          )}
        >
          <div>
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="flex gap-3 flex-wrap mb-4">
              {cart.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={getSafeImageSrc(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
              ))}
              {cart.length > 3 && (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                  +{cart.length - 3}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatPrice(convertPrice(subtotal, currency), currency)}
              </span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-medium">
                  -
                  {formatPrice(
                    convertPrice(couponDiscount, currency),
                    currency,
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                {shippingCost === 0
                  ? "FREE"
                  : formatPrice(
                      convertPrice(shippingCost, currency),
                      currency,
                    )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">
                {formatPrice(convertPrice(tax, currency), currency)}
              </span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-black text-2xl text-primary">
                {formatPrice(totalForGateway, currency)}
              </span>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium">Money-back guarantee</p>
              <p className="text-muted-foreground">
                30-day returns on all orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
