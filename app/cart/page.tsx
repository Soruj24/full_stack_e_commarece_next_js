// app/cart/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useSaveForLater } from "@/context/SaveForLaterContext";
import {
  CartEmptyState,
  CartHeader,
  CartItem,
  CartFeatures,
  CartSummary,
  CartSaveForLater,
} from "@/components/cart";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } =
    useCart();
  const { savedItems } = useSaveForLater();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const applyPromoCode = async () => {
    if (!promoCode) return;
    setIsApplyingCoupon(true);
    try {
      const res = await fetch(`/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, amount: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discount);
        toast.success(`Coupon applied: ${data.discountAmount} off`);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax - discount;

  if (cart.length === 0) {
    return (
      <CartEmptyState savedItemsCount={savedItems.length} />
    );
  }

  return (
    <div className="min-h-screen bg-background/95 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-10">
            <CartHeader totalItems={totalItems} />

            <div className="space-y-6">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>

            <CartSaveForLater />

            <CartFeatures shipping={shipping} />
          </div>

          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            discount={discount}
            total={total}
            totalItems={totalItems}
            promoCode={promoCode}
            isApplyingCoupon={isApplyingCoupon}
            onPromoCodeChange={setPromoCode}
            onApplyPromoCode={applyPromoCode}
          />
        </div>
      </div>
    </div>
  );
}