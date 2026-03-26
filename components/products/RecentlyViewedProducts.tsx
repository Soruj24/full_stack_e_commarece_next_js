"use client";

import { useState, useEffect } from "react";
import { useRecentlyViewed, RecentlyViewedProduct } from "@/context/RecentlyViewedContext";
import { useLocalization } from "@/context/LocalizationContext";
import { formatPrice, convertPrice } from "@/lib/localization";
import { cn, getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Clock, X, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

interface RecentlyViewedProductsProps {
  title?: string;
  maxProducts?: number;
  showClearButton?: boolean;
  variant?: "default" | "compact" | "carousel";
  className?: string;
}

export function RecentlyViewedProducts({
  title = "Recently Viewed",
  maxProducts = 6,
  showClearButton = false,
  variant = "default",
  className,
}: RecentlyViewedProductsProps) {
  const { products, removeProduct, clearAll } = useRecentlyViewed();
  const { currency } = useLocalization();
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayedProducts = products.slice(0, maxProducts);

  if (!mounted || displayedProducts.length === 0) {
    return null;
  }

  const handleQuickAddToCart = (product: RecentlyViewedProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: 10,
    });
    toast.success(`Added ${product.name} to cart`);
  };

  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        {title && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
        )}
        <div className="space-y-2">
          {displayedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug || product.id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                <Image
                  src={getSafeImageSrc(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackImage();
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(convertPrice(product.price, currency), currency)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  removeProduct(product.id);
                }}
                aria-label={`Remove ${product.name} from recently viewed`}
              >
                <X className="w-4 h-4" />
              </Button>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""} viewed
            </p>
          </div>
        </div>
        {showClearButton && products.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toast("Clear all recently viewed items?", {
                action: {
                  label: "Clear All",
                  onClick: () => clearAll(),
                },
                cancel: {
                  label: "Cancel",
                  onClick: () => {},
                },
              });
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displayedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/products/${product.slug || product.id}`}
              className="group block cursor-pointer"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
                <Image
                  src={getSafeImageSrc(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackImage();
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  onClick={(e) => {
                    e.preventDefault();
                    handleQuickAddToCart(product);
                  }}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeProduct(product.id);
                  }}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
                  aria-label={`Remove ${product.name} from recently viewed`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                  {product.name}
                </h3>
                {product.category && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {product.category}
                  </p>
                )}
                <p className="font-bold text-primary">
                  {formatPrice(convertPrice(product.price, currency), currency)}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="outline" asChild className="gap-2">
          <Link href="/products">
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";

export function RecentlyViewedWidget() {
  const { products } = useRecentlyViewed();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || products.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <div className="bg-card rounded-2xl shadow-2xl border p-4 max-w-xs animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Recently Viewed</span>
          <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">
            {products.length}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {products.slice(0, 5).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug || product.id}`}
              className="shrink-0 group"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted mb-1">
                <Image
                  src={getSafeImageSrc(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackImage();
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2" asChild>
          <Link href="#recently-viewed">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
