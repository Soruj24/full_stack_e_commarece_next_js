import { useState, useEffect } from "react";
import { useRecentlyViewed, RecentlyViewedProduct } from "@/features/common/hooks/RecentlyViewedContext";
import { useCart } from "@/features/cart/context/CartContext";
import { toast } from "sonner";

export function useRecentlyViewedProducts(maxProducts = 6) {
  const { products, removeProduct, clearAll } = useRecentlyViewed();
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const displayedProducts = products.slice(0, maxProducts);

  const handleQuickAddToCart = (product: RecentlyViewedProduct) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, stock: 10 });
    toast.success(`Added ${product.name} to cart`);
  };

  return { products, displayedProducts, mounted, removeProduct, clearAll, handleQuickAddToCart };
}
