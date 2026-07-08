import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "@/modules/cart/context/CartContext";
import { useWishlist } from "@/features/wishlist/hooks/WishlistContext";

export function useCartDrawer(onClose: () => void) {
  const router = useRouter();
  const { cart: items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const { toggleWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const shippingThreshold = 99;
  const shippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemove = (itemId: string) => {
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

  return {
    items, subtotal, totalItems, isLoading, removingId,
    shippingProgress, remainingForFreeShipping, shippingThreshold,
    handleQuantityChange, handleRemove, handleMoveToWishlist, handleCheckout,
  };
}
