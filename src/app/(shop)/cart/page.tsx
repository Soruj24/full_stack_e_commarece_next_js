"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles, Tag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/modules/cart/context/CartContext";
import { useSaveForLater } from "@/modules/cart/context/SaveForLaterContext";
import { useLocalization } from "@/modules/common/hooks/LocalizationContext";
import { convertPrice, formatPrice } from "@/lib/localization";
import { calculateTaxIntl, getShippingRatesIntl } from "@/modules/checkout/utils/checkout-utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/CartItem";
import { CartEmptyState } from "@/components/cart/CartEmptyState";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const { savedItems } = useSaveForLater();
  const { currency, country } = useLocalization();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const fmt = (amount: number) => formatPrice(convertPrice(amount, currency), currency);

  const applyCoupon = async () => {
    if (!promoCode.trim()) return;
    setIsApplying(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim(), cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.coupon.discount);
        setAppliedCoupon(promoCode.trim().toUpperCase());
      }
    } catch {
      // silently fail
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon("");
    setPromoCode("");
  };

  const shippingRates = getShippingRatesIntl("", country, subtotal);
  const freeShippingThreshold = 500;
  const shipping = subtotal >= freeShippingThreshold ? 0 : (shippingRates.length > 0 ? Math.min(...shippingRates.map((r) => r.rate)) : 50);
  const tax = calculateTaxIntl(subtotal - discount, country);
  const total = Math.max(0, subtotal + shipping + tax - discount);

  const deliveryDays = shippingRates.find((r) => r.rate === shipping)?.estimatedDays || "3-5";

  if (cart.length === 0) {
    return <CartEmptyState savedItemsCount={savedItems.length} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-primary/8 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Shopping <span className="text-primary">Cart</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive font-bold text-sm gap-2 rounded-xl"
            onClick={clearCart}
          >
            Clear All
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Cart Items */}
          <div className="flex-1 space-y-6">
            {/* Free Shipping Progress */}
            {subtotal < freeShippingThreshold && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold">
                      Add {fmt(freeShippingThreshold - subtotal)} more for <span className="text-primary">free shipping!</span>
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}

            {subtotal >= freeShippingThreshold && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">
                    You qualify for free shipping!
                  </span>
                </div>
              </motion.div>
            )}

            {/* Cart Items */}
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <CartItem
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {[
                { icon: "🚚", label: "Free Shipping", sub: "On orders over $500" },
                { icon: "🔒", label: "Secure Checkout", sub: "256-bit SSL encryption" },
                { icon: "↩️", label: "30 Day Returns", sub: "Hassle-free returns" },
              ].map((f) => (
                <div key={f.label} className="p-4 rounded-2xl bg-muted/20 border border-border/30 text-center space-y-2">
                  <span className="text-2xl">{f.icon}</span>
                  <p className="text-xs font-bold uppercase tracking-wider">{f.label}</p>
                  <p className="text-[10px] text-muted-foreground">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:w-[420px]">
            <div className="sticky top-24 space-y-6">
              {/* Summary Card */}
              <div className="rounded-3xl bg-card border border-border/50 shadow-2xl shadow-black/5 overflow-hidden">
                {/* Header */}
                <div className="p-8 pb-6">
                  <h2 className="text-2xl font-black tracking-tight">Order Summary</h2>
                </div>

                <Separator className="bg-border/30" />

                {/* Price Breakdown */}
                <div className="p-8 space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-medium">
                      Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </span>
                    <span className="font-bold text-sm">{fmt(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-medium">Shipping</span>
                    <span className="font-bold text-sm">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        fmt(shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-medium">Estimated Tax</span>
                    <span className="font-bold text-sm">{fmt(tax)}</span>
                  </div>

                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex justify-between items-center text-emerald-600"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Coupon Discount</span>
                        <button
                          onClick={removeCoupon}
                          className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <span className="font-bold text-sm">-{fmt(discount)}</span>
                    </motion.div>
                  )}

                  <Separator className="bg-border/30" />

                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-3xl font-black tracking-tight text-primary">{fmt(total)}</span>
                  </div>
                </div>

                <Separator className="bg-border/30" />

                {/* Coupon */}
                <div className="p-8 space-y-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-sm text-emerald-700">{appliedCoupon}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">Applied</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Coupon Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                          disabled={isApplying}
                          className="flex-1 h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                        />
                        <Button
                          variant="outline"
                          className="h-12 px-6 rounded-xl font-bold text-sm border-border/50 hover:bg-primary hover:text-primary-foreground transition-all"
                          disabled={isApplying || !promoCode.trim()}
                          onClick={applyCoupon}
                        >
                          {isApplying ? "..." : "Apply"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="bg-border/30" />

                {/* Estimated Delivery */}
                <div className="p-8">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-border/30">
                    <div className="text-xl">📦</div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Estimated Delivery</p>
                      <p className="text-sm font-semibold mt-0.5">
                        {deliveryDays} business days
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="px-8 pb-8">
                  <Link href="/checkout" className="block">
                    <Button className="w-full h-14 rounded-2xl font-bold text-base gap-3 shadow-xl shadow-primary/20 group">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mt-4">
                    Secure Payment • SSL Encrypted
                  </p>
                </div>
              </div>

              {/* Loyalty Points */}
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 flex items-start gap-4">
                <div className="text-2xl">🎁</div>
                <div>
                  <h4 className="font-bold text-sm text-primary">Earn Loyalty Points</h4>
                  <p className="text-xs text-primary/70 font-medium leading-relaxed mt-1">
                    You&apos;ll earn <span className="font-bold text-primary">{Math.floor(total / 10)} points</span> with this purchase!
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
