"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CartNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    image: string;
    price: number;
    quantity: number;
  } | null;
}

export function CartNotification({ isOpen, onClose, product }: CartNotificationProps) {
  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-black/20 border border-zinc-200 dark:border-white/10 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-white/10 shrink-0">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-600">
                    Added to Cart
                  </span>
                </div>
                <p className="font-semibold text-sm line-clamp-2 mb-1">
                  {product.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {product.quantity} × ${product.price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-zinc-100 dark:bg-white/10 text-center text-sm font-semibold rounded-xl hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FlyingProductProps {
  productImage: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onComplete: () => void;
}

export function FlyingProduct({
  productImage,
  startPosition,
  endPosition,
  onComplete,
}: FlyingProductProps) {
  return (
    <motion.div
      initial={{
        x: startPosition.x,
        y: startPosition.y,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x: endPosition.x,
        y: endPosition.y,
        opacity: 0,
        scale: 0.2,
        rotate: 360,
      }}
      transition={{
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      }}
      onAnimationComplete={onComplete}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-xl border-2 border-white">
        <Image
          src={productImage}
          alt="Product"
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
}

interface CartBounceProps {
  cartPosition: { x: number; y: number };
}

export function CartBounce({ cartPosition }: CartBounceProps) {
  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{
        scale: [1, 1.3, 0.9, 1.1, 1],
      }}
      transition={{
        duration: 0.5,
        times: [0, 0.2, 0.4, 0.6, 1],
      }}
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: cartPosition.x - 20,
        top: cartPosition.y - 20,
      }}
    >
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
        <ShoppingCart className="w-5 h-5 text-primary-foreground" />
      </div>
    </motion.div>
  );
}

export function useAddToCartAnimation() {
  const [isFlying, setIsFlying] = useState(false);
  const [flyingProduct, setFlyingProduct] = useState<{
    image: string;
    start: { x: number; y: number };
  } | null>(null);
  const [cartPosition, setCartPosition] = useState({ x: 0, y: 0 });
  const [showBounce, setShowBounce] = useState(false);

  const triggerAnimation = (
    productImage: string,
    startPosition: { x: number; y: number }
  ) => {
    const cartIcon = document.querySelector('[aria-label="Cart"]');
    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect();
      setCartPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    setFlyingProduct({
      image: productImage,
      start: startPosition,
    });
    setIsFlying(true);
    setShowBounce(true);
  };

  const handleFlightComplete = () => {
    setIsFlying(false);
    setFlyingProduct(null);
    setTimeout(() => setShowBounce(false), 500);
  };

  return {
    isFlying,
    flyingProduct,
    cartPosition,
    showBounce,
    triggerAnimation,
    handleFlightComplete,
  };
}
