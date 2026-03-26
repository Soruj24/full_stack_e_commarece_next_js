"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Star, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/context/LocalizationContext";
import { formatPrice, convertPrice } from "@/lib/localization";
import { getSafeImageSrc, getFallbackImage, cn } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: { name: string };
  rating?: number;
  numReviews?: number;
  stock?: number;
}

interface CompareProductCardProps {
  product: Product;
  index: number;
  addedToCart: boolean;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export function CompareProductCard({
  product,
  index,
  addedToCart,
  onRemove,
  onAddToCart,
}: CompareProductCardProps) {
  const { currency } = useLocalization();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm"
    >
      <div className="relative aspect-square bg-muted">
        <Image
          src={getSafeImageSrc(product.images?.[0])}
          alt={product.name}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackImage();
          }}
        />
        <button
          onClick={() => onRemove(product._id)}
          className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
          aria-label={`Remove ${product.name} from comparison`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <Link href={`/products/${product._id}`}>
            <h3 className="font-bold line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.category && (
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
          )}
        </div>

        <p className="text-2xl font-black text-primary">
          {formatPrice(convertPrice(product.price, currency), currency)}
        </p>

        {product.rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted"
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              ({product.numReviews || 0})
            </span>
          </div>
        )}

        {product.stock !== undefined && (
          <div className="text-sm">
            {product.stock === 0 ? (
              <span className="text-red-500">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-orange-500">Only {product.stock} left</span>
            ) : (
              <span className="text-green-500">In Stock</span>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <Link href={`/products/${product._id}`}>
              View Details
            </Link>
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onAddToCart(product._id)}
            disabled={product.stock === 0}
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";