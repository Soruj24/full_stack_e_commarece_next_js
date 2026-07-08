"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartDrawer } from "@/modules/cart/hooks/use-cart-drawer";
import { DrawerHeader } from "./cart-drawer/DrawerHeader";
import { ShippingProgressBar } from "./cart-drawer/ShippingProgressBar";
import { CartEmptyState } from "./cart-drawer/CartEmptyState";
import { CartItemRow } from "./cart-drawer/CartItemRow";
import { PromoCodeInput } from "./cart-drawer/PromoCodeInput";
import { CartSummary } from "./cart-drawer/CartSummary";
import { CartCheckoutButton } from "./cart-drawer/CartCheckoutButton";
import { TrustBadges } from "./cart-drawer/TrustBadges";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items, subtotal, totalItems, isLoading, removingId,
    shippingProgress, remainingForFreeShipping, shippingThreshold,
    handleQuantityChange, handleRemove, handleMoveToWishlist, handleCheckout,
  } = useCartDrawer(onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-zinc-950 shadow-2xl z-50 flex flex-col"
          >
            <DrawerHeader totalItems={totalItems} onClose={onClose} />
            <ShippingProgressBar
              subtotal={subtotal}
              shippingThreshold={shippingThreshold}
              shippingProgress={shippingProgress}
              remainingForFreeShipping={remainingForFreeShipping}
            />
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <CartEmptyState onClose={onClose} />
              ) : (
                <div className="px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      removingId={removingId}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      onMoveToWishlist={handleMoveToWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-zinc-100 dark:border-white/10 bg-white dark:bg-zinc-950">
                <PromoCodeInput />
                <CartSummary subtotal={subtotal} remainingForFreeShipping={remainingForFreeShipping} />
                <CartCheckoutButton isLoading={isLoading} onCheckout={handleCheckout} />
                <TrustBadges />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
