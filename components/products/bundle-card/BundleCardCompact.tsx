"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Package, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bundle } from "@/context/BundleContext";

interface BundleCardCompactProps {
  bundle: Bundle;
  className?: string;
  isAdding: boolean;
  justAdded: boolean;
  isOutOfStock: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
}

export function BundleCardCompact({
  bundle,
  className,
  isAdding,
  justAdded,
  isOutOfStock,
  onAddToCart,
}: BundleCardCompactProps) {
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
          onClick={onAddToCart}
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
