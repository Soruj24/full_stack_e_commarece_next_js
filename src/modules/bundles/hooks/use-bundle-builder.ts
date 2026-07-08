import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/modules/cart/context/CartContext";
import type { IProduct } from "@/shared/types";
import type { BundleItem } from "@/modules/bundles/types/bundle";

export function useBundleBuilder(products: IProduct[], bundleName: string, onBundleComplete?: (items: BundleItem[]) => void) {
  const [items, setItems] = useState<BundleItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const { addToCart } = useCart();

  const MIN_ITEMS = 2;
  const MAX_ITEMS = 5;

  const addItem = (product: IProduct) => {
    if (items.length >= MAX_ITEMS) { toast.error(`Maximum ${MAX_ITEMS} items in a bundle`); return; }
    if (items.find((i) => i.product._id === product._id)) { toast.error("Product already in bundle"); return; }
    setItems([...items, { product, quantity: 1 }]);
  };

  const removeItem = (productId: string) => setItems(items.filter((i) => i.product._id !== productId));

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map((i) => (i.product._id === productId ? { ...i, quantity: newQuantity } : i)));
  };

  const calculateSavings = () => {
    const totalOriginal = items.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0);
    const bundleDiscount = totalOriginal * 0.15;
    return { original: totalOriginal, discounted: totalOriginal - bundleDiscount, savings: bundleDiscount };
  };

  const isInBundle = (productId: string) => items.some((i) => i.product._id === productId);

  const handleAddBundleToCart = async () => {
    if (items.length < MIN_ITEMS) { toast.error(`Add at least ${MIN_ITEMS} items to create a bundle`); return; }
    setIsAddingToCart(true);
    try {
      const bundleItem = {
        id: `bundle-${Date.now()}`,
        name: bundleName,
        price: calculateSavings().discounted,
        image: items[0].product.images?.[0] || "/placeholder.png",
        quantity: 1, stock: 99, isBundle: true,
        bundleProducts: items.map((i) => ({
          id: i.product._id, name: i.product.name, price: i.product.discountPrice || i.product.price, image: i.product.images?.[0] || "",
        })),
      };
      addToCart(bundleItem);
      setShowAdded(true);
      onBundleComplete?.(items);
      toast.success("Bundle added to cart!");
      setTimeout(() => setShowAdded(false), 2000);
    } catch {
      toast.error("Failed to add bundle to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const availableProducts = products.filter((p) => !isInBundle(p._id) && p.stock > 0);
  const savings = calculateSavings();

  return {
    items, isAddingToCart, showAdded, MIN_ITEMS, MAX_ITEMS,
    addItem, removeItem, updateQuantity, calculateSavings, isInBundle,
    handleAddBundleToCart, availableProducts, savings,
  };
}
