"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  Check,
  Sparkles,
  ArrowRight,
  Loader2,
  Percent,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface BundleItem {
  product: IProduct;
  quantity: number;
}

interface BundleBuilderProps {
  products: IProduct[];
  bundleName?: string;
  onBundleComplete?: (bundle: BundleItem[]) => void;
}

export function BundleBuilder({
  products,
  bundleName = "Custom Bundle",
  onBundleComplete,
}: BundleBuilderProps) {
  const [items, setItems] = useState<BundleItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const { addToCart } = useCart();

  const MIN_ITEMS = 2;
  const MAX_ITEMS = 5;

  const addItem = (product: IProduct) => {
    if (items.length >= MAX_ITEMS) {
      toast.error(`Maximum ${MAX_ITEMS} items in a bundle`);
      return;
    }
    if (items.find((i) => i.product._id === product._id)) {
      toast.error("Product already in bundle");
      return;
    }
    setItems([...items, { product, quantity: 1 }]);
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((i) => i.product._id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(
      items.map((i) =>
        i.product._id === productId ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  const calculateSavings = () => {
    const totalOriginal = items.reduce(
      (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
      0
    );
    const bundleDiscount = totalOriginal * 0.15;
    return {
      original: totalOriginal,
      discounted: totalOriginal - bundleDiscount,
      savings: bundleDiscount,
    };
  };

  const isInBundle = (productId: string) => {
    return items.some((i) => i.product._id === productId);
  };

  const handleAddBundleToCart = async () => {
    if (items.length < MIN_ITEMS) {
      toast.error(`Add at least ${MIN_ITEMS} items to create a bundle`);
      return;
    }

    setIsAddingToCart(true);
    try {
      const bundleItem = {
        id: `bundle-${Date.now()}`,
        name: bundleName,
        price: calculateSavings().discounted,
        image: items[0].product.images?.[0] || "/placeholder.png",
        quantity: 1,
        stock: 99,
        isBundle: true,
        bundleProducts: items.map((i) => ({
          id: i.product._id,
          name: i.product.name,
          price: i.product.discountPrice || i.product.price,
          image: i.product.images?.[0] || "",
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

  const availableProducts = products.filter(
    (p) => !isInBundle(p._id) && p.stock > 0
  );

  const savings = calculateSavings();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-b border-zinc-200 dark:border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Build Your Bundle</h2>
            <p className="text-sm text-zinc-500">
              Add {MIN_ITEMS}-{MAX_ITEMS} items and save 15%
            </p>
          </div>
        </div>
        
        {/* Bundle Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium mb-2">
            <span>Bundle Progress</span>
            <span className={items.length >= MIN_ITEMS ? "text-green-600" : ""}>
              {items.length}/{MIN_ITEMS} min required
            </span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((items.length / MAX_ITEMS) * 100, 100)}%` }}
              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Bundle Items */}
      {items.length > 0 && (
        <div className="p-6 border-b border-zinc-200 dark:border-white/10">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Your Bundle Items
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-white/5 rounded-2xl"
                >
                  <img
                    src={item.product.images?.[0] || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      ${(item.product.discountPrice || item.product.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/20 flex items-center justify-center hover:border-primary disabled:opacity-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/20 flex items-center justify-center hover:border-primary"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Savings Summary */}
          {items.length >= MIN_ITEMS && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Bundle Subtotal</span>
                <span className="font-semibold">
                  ${savings.original.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <Percent className="w-4 h-4" />
                  Bundle Discount (15%)
                </span>
                <span className="font-bold text-green-600">
                  -${savings.savings.toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-green-500/20 my-3" />
              <div className="flex items-center justify-between">
                <span className="font-bold">Bundle Total</span>
                <span className="text-xl font-black text-green-600">
                  ${savings.discounted.toFixed(2)}
                </span>
              </div>
            </motion.div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddBundleToCart}
            disabled={items.length < MIN_ITEMS || isAddingToCart}
            className="w-full mt-4 h-12 rounded-xl font-bold text-sm"
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Bundle...
              </>
            ) : showAdded ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Bundle Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add Bundle to Cart
              </>
            )}
          </Button>
        </div>
      )}

      {/* Available Products */}
      <div className="p-6">
        <h3 className="text-sm font-semibold mb-4">
          Available Products ({availableProducts.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableProducts.slice(0, 8).map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.02 }}
              className="relative bg-zinc-50 dark:bg-white/5 rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => addItem(product)}
            >
              <div className="aspect-square relative">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-medium line-clamp-1">{product.name}</h4>
                <p className="text-xs font-bold text-primary mt-1">
                  ${(product.discountPrice || product.price).toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {availableProducts.length > 8 && (
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 mt-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
