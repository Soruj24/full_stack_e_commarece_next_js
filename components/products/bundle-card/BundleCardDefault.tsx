"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bundle } from "@/features/bundles/context/BundleContext";

interface BundleCardDefaultProps {
  bundle: Bundle;
  className?: string;
  inCart: boolean;
  isAdding: boolean;
  justAdded: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
}

export function BundleCardDefault({
  bundle,
  className,
  inCart,
  isAdding,
  justAdded,
  isLowStock,
  isOutOfStock,
  onAddToCart,
}: BundleCardDefaultProps) {
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
                  <p className="text-sm opacity-80">
                    {bundle.products.length} items included
                  </p>
                  <h3 className="font-bold text-lg line-clamp-1">
                    {bundle.name}
                  </h3>
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
          onClick={onAddToCart}
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
