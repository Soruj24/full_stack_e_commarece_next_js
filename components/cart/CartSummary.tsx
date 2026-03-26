"use client";

import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  totalItems: number;
  promoCode: string;
  isApplyingCoupon: boolean;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: () => void;
}

export function CartSummary({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  totalItems,
  promoCode,
  isApplyingCoupon,
  onPromoCodeChange,
  onApplyPromoCode,
}: CartSummaryProps) {
  return (
    <aside className="lg:w-[450px]">
      <div className="sticky top-24 space-y-8">
        <div className="rounded-[48px] bg-card border border-border/50 shadow-2xl shadow-primary/5 p-10 space-y-8">
          <h2 className="text-3xl font-black tracking-tighter">
            Order <span className="text-primary">Summary</span>
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">
                Subtotal ({totalItems} items)
              </span>
              <span className="font-black">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">
                Shipping Estimate
              </span>
              <span className="font-black">
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">
                Estimated Tax (15%)
              </span>
              <span className="font-black">${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm font-medium text-green-500">
                <span>Promo Discount</span>
                <span className="font-black">
                  -${discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="h-px bg-border/50 my-6" />

            <div className="flex justify-between items-end">
              <span className="text-lg font-black tracking-tight">
                Total Amount
              </span>
              <span className="text-4xl font-black tracking-tighter text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => onPromoCodeChange(e.target.value)}
                disabled={isApplyingCoupon}
                className="pl-12 pr-24 h-14 rounded-xl bg-muted/50 border-border/50 font-bold"
              />
              <button
                onClick={onApplyPromoCode}
                disabled={isApplyingCoupon || !promoCode}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isApplyingCoupon ? "..." : "Apply"}
              </button>
            </div>
          </div>

          <Link href="/checkout" className="block">
            <Button className="w-full rounded-[24px] h-16 font-black text-lg shadow-2xl shadow-primary/20 gap-3 group">
              Proceed to Checkout{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            Secure Payment Guaranteed
          </p>
        </div>

        <div className="rounded-[32px] bg-primary/5 border border-primary/10 p-8 flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-primary text-sm uppercase tracking-widest">
              Loyalty Points
            </h4>
            <p className="text-xs text-primary/70 font-medium leading-relaxed mt-1">
              You&apos;ll earn{" "}
              <span className="font-black text-primary">
                {(total / 10).toFixed(0)} points
              </span>{" "}
              with this purchase to use on your next order!
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { ShoppingBag } from "lucide-react";