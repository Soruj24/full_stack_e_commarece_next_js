"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Package,
  Tag,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bundle, useBundle } from "@/context/BundleContext";
import { toast } from "sonner";

interface BundleCardProps {
  bundle: Bundle;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function BundleCard({
  bundle,
  variant = "default",
  className,
}: BundleCardProps) {
  const { addBundleToCart, isBundleInCart } = useBundle();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inCart = isBundleInCart(bundle._id);
  const isLowStock = bundle.stock > 0 && bundle.stock <= 5;
  const isOutOfStock = bundle.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("This bundle is currently out of stock");
      return;
    }

    setIsAdding(true);
    addBundleToCart(bundle);

    setTimeout(() => {
      setJustAdded(true);
      setIsAdding(false);
      toast.success(`${bundle.name} added to cart!`);
      setTimeout(() => setJustAdded(false), 2000);
    }, 500);
  };

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300",
          className
        )}
      >
        <Link href={`/bundles/${bundle._id}`} className="block p-4">
          <div className="flex gap-4">
            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
              <Image
                src={bundle.products[0]?.image || "/placeholder.svg"}
                alt={bundle.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-1 right-1 flex -space-x-1">
                {bundle.products.slice(1, 3).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-full bg-primary border-2 border-white flex items-center justify-center"
                  >
                    <Package className="w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                {bundle.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  ${bundle.bundlePrice.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  ${bundle.originalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Link>
        <div className="px-4 pb-4">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            size="sm"
            className="w-full"
          >
            {justAdded ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Added
              </>
            ) : isAdding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative bg-gradient-to-br from-primary/5 via-card to-primary/10 border-2 border-primary/20 rounded-3xl overflow-hidden",
          className
        )}
      >
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-primary text-white font-black px-4 py-1 text-sm">
            Save {bundle.discountPercentage}%
          </Badge>
        </div>

        <Link href={`/bundles/${bundle._id}`} className="block p-6">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted mb-4">
            <div className="absolute inset-0 flex">
              {bundle.products.slice(0, 3).map((product, idx) => (
                <div
                  key={idx}
                  className="relative flex-1 overflow-hidden"
                  style={{
                    clipPath:
                      idx === 0
                        ? "inset(0 50% 0 0)"
                        : idx === 2
                        ? "inset(0 0 0 50%)"
                        : "inset(0 0 0 0)",
                  }}
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-xl">{bundle.name}</h3>
              <p className="text-white/80 text-sm line-clamp-1">
                {bundle.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary">
                  ${bundle.bundlePrice.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${bundle.originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  You save ${bundle.discount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {bundle.products.slice(0, 4).map((product, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-muted px-2 py-1 rounded-full"
                >
                  {product.name}
                </span>
              ))}
              {bundle.products.length > 4 && (
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  +{bundle.products.length - 4} more
                </span>
              )}
            </div>

            {isLowStock && (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Only {bundle.stock} left in stock
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="px-6 pb-6">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className="w-full h-12 text-base font-bold rounded-xl"
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : justAdded ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Added to Cart!
              </>
            ) : isAdding ? (
              "Adding to Cart..."
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add Bundle to Cart
              </>
            )}
          </Button>
          <Link
            href={`/bundles/${bundle._id}`}
            className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View Bundle Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card border border-border/50 rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",
        className
      )}
    >
      <div className="relative">
        <Link href={`/bundles/${bundle._id}`} className="block">
          <div className="relative aspect-square bg-muted overflow-hidden">
            <div className="absolute inset-0 flex">
              {bundle.products.slice(0, 4).map((product, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "relative flex-1 overflow-hidden",
                    idx > 0 && "border-l border-white/10"
                  )}
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className="bg-primary text-white font-black">
                -{bundle.discountPercentage}%
              </Badge>
              {isLowStock && (
                <Badge variant="destructive" className="font-bold">
                  Only {bundle.stock} left
                </Badge>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between">
                <div className="text-white">
                  <p className="text-sm opacity-80">{bundle.products.length} items included</p>
                  <h3 className="font-bold text-lg line-clamp-1">{bundle.name}</h3>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {bundle.description}
        </p>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-primary">
                ${bundle.bundlePrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${bundle.originalPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-green-600 font-medium">
              Save ${bundle.discount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {bundle.products.slice(0, 3).map((product, idx) => (
            <span
              key={idx}
              className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
            >
              {product.name}
            </span>
          ))}
          {bundle.products.length > 3 && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              +{bundle.products.length - 3}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock || inCart}
          className="w-full h-11 font-semibold rounded-xl"
        >
          {inCart ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              In Cart
            </>
          ) : justAdded ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Added!
            </>
          ) : isAdding ? (
            "Adding..."
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add Bundle to Cart
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

interface BundleGridProps {
  bundles: Bundle[];
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function BundleGrid({ bundles, variant = "default", className }: BundleGridProps) {
  if (bundles.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No bundles available at the moment.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        variant === "featured"
          ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
    >
      {bundles.map((bundle) => (
        <BundleCard key={bundle._id} bundle={bundle} variant={variant} />
      ))}
    </div>
  );
}
