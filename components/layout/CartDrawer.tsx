"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag,
  ArrowRight,
  Heart,
  Tag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { cart: items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const { toggleWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const shippingThreshold = 99;
  const shippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId);
    removeFromCart(itemId);
    setRemovingId(null);
  };

  const handleMoveToWishlist = async (item: CartItem) => {
    removeFromCart(item.id);
    await toggleWishlist(item.id);
  };

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-zinc-950 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold">Your Cart ({totalItems})</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {subtotal > 0 && subtotal < shippingThreshold && (
              <div className="px-6 py-3 bg-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {remainingForFreeShipping > 0
                      ? `$${remainingForFreeShipping.toFixed(2)} away from free shipping`
                      : "You've unlocked free shipping!"}
                  </span>
                </div>
                <div className="h-1.5 bg-primary/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                  <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-zinc-300" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Your cart is empty</h3>
                  <p className="text-sm text-zinc-500 text-center mb-6">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <Button onClick={onClose} className="rounded-full px-8">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`flex gap-4 p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl transition-opacity ${
                        removingId === item.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {item.isBundle && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary text-[9px] font-bold text-white rounded">
                            Bundle
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                              {item.name}
                            </h4>
                            {item.isBundle && (
                              <p className="text-[10px] text-primary">
                                Bundle ({item.bundleProducts?.length || 0} items)
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 flex items-center justify-center hover:border-primary transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          className="flex items-center gap-1 mt-2 text-[11px] text-zinc-400 hover:text-primary transition-colors"
                        >
                          <Heart className="w-3 h-3" />
                          Move to wishlist
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-zinc-100 dark:border-white/10 bg-white dark:bg-zinc-950">
                {/* Promo Code */}
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/10">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <Button variant="outline" className="rounded-xl px-4">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Summary */}
                <div className="px-6 py-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Shipping</span>
                    <span className={remainingForFreeShipping > 0 ? "text-zinc-500" : "text-green-600 font-semibold"}>
                      {remainingForFreeShipping > 0 ? "Calculated at checkout" : "FREE"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Tax</span>
                    <span className="text-zinc-400 text-xs">Calculated at checkout</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="px-6 pb-4">
                  <Button
                    onClick={handleCheckout}
                    className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-zinc-400 mt-2">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="px-6 py-3 bg-zinc-50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/10">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span className="text-[9px] text-zinc-500">Secure Checkout</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                      <span className="text-[9px] text-zinc-500">30-Day Returns</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Truck className="w-4 h-4 text-orange-600" />
                      <span className="text-[9px] text-zinc-500">Free Shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
