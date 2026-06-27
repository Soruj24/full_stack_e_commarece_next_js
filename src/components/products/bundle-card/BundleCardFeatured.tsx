"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle2, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bundle } from "@/features/bundles/context/BundleContext";

interface BundleCardFeaturedProps {
  bundle: Bundle;
  className?: string;
  isAdding: boolean;
  justAdded: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
}

export function BundleCardFeatured({
  bundle,
  className,
  isAdding,
  justAdded,
  isLowStock,
  isOutOfStock,
  onAddToCart,
}: BundleCardFeaturedProps) {
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
          onClick={onAddToCart}
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
