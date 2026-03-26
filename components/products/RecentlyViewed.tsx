"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Clock, 
  X, 
  Trash2, 
  ChevronRight,
  ShoppingCart,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 12;

interface RecentlyViewedProduct extends IProduct {
  viewedAt: number;
}

export function useRecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProducts(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const addToRecentlyViewed = useCallback((product: IProduct) => {
    setProducts((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      const newProduct = { ...product, viewedAt: Date.now() };
      const updated = [newProduct, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromRecentlyViewed = useCallback((productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p._id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setProducts([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    products,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
  };
}

interface RecentlyViewedProps {
  maxItems?: number;
  showClearButton?: boolean;
}

export function RecentlyViewed({
  maxItems = 8,
  showClearButton = true,
}: RecentlyViewedProps) {
  const { products, removeFromRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const [isVisible, setIsVisible] = useState(false);

  if (products.length === 0) return null;

  const displayedProducts = products.slice(0, maxItems);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Recently Viewed</h3>
          <span className="text-xs text-zinc-500">({products.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {showClearButton && products.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentlyViewed}
              className="text-xs h-8"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="h-8"
          >
            {isVisible ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <Link
                    href={`/products/${product._id}`}
                    className="block bg-zinc-50 dark:bg-white/5 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromRecentlyViewed(product._id);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-medium line-clamp-2 mb-1">
                        {product.name}
                      </h4>
                      <p className="text-xs font-bold text-primary">
                        ${(product.discountPrice || product.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {products.length > maxItems && (
              <div className="p-4 pt-0">
                <Link
                  href="/recently-viewed"
                  className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:underline"
                >
                  View All {products.length} Products
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface RecentlyViewedBannerProps {
  currentProductId: string;
}

export function RecentlyViewedBanner({ currentProductId }: RecentlyViewedBannerProps) {
  const { products } = useRecentlyViewed();
  const otherProducts = products.filter((p) => p._id !== currentProductId).slice(0, 3);

  if (otherProducts.length === 0) return null;

  return (
    <div className="bg-zinc-50 dark:bg-white/5 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Recently Viewed
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {otherProducts.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="flex-shrink-0 w-24 group"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 mb-2">
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-xs font-medium line-clamp-2">{product.name}</p>
            <p className="text-xs font-bold text-primary">
              ${(product.discountPrice || product.price).toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
