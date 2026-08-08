"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice, convertPrice } from "@/lib/localization";
import { useStock } from "@/modules/cart/context/StockContext";
import { cn } from "@/lib/utils";

interface ProductCardInfoProps {
  product: {
    _id: string;
    name: string;
    category: { name: string; slug: string };
    brand?: string;
    rating: number;
    numReviews: number;
    price: number;
    stock: number;
  };
  hasDiscount: boolean;
  currentPrice: number;
  currency: string;
  handleAddToCart: (e: React.MouseEvent) => void;
  t: (key: string) => string;
}

export function ProductCardInfo({
  product,
  hasDiscount,
  currentPrice,
  currency,
  handleAddToCart,
  t,
}: ProductCardInfoProps) {
  const { checkStockStatus } = useStock();
  const stockStatus = checkStockStatus(product.stock);

  const stockConfig = {
    in_stock: { label: "In Stock", color: "text-emerald-600 dark:text-emerald-400" },
    low_stock: { label: `Only ${product.stock} left`, color: "text-orange-600 dark:text-orange-400" },
    out_of_stock: { label: "Out of Stock", color: "text-red-600 dark:text-red-400" },
    pre_order: { label: "Pre-order", color: "text-blue-600 dark:text-blue-400" },
  };

  const stockInfo = stockConfig[stockStatus];

  return (
    <div className="p-4 space-y-3">
      {/* Category */}
      <Link
        href={`/products?category=${product.category.slug}`}
        className="inline-block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        {product.category.name}
      </Link>

      {/* Product Name */}
      <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
        <Link
          href={`/products/${product._id}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-sm"
        >
          {product.name}
        </Link>
      </h3>

      {/* Brand */}
      {product.brand && (
        <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
          {product.brand}
        </p>
      )}

      {/* Rating */}
      {product.numReviews > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.round(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted/40 text-muted/40",
                )}
                strokeWidth={0}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-muted-foreground/40">
            ({product.numReviews})
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-2 pt-1">
        <span className="text-lg font-bold tracking-tight text-foreground">
          {formatPrice(convertPrice(currentPrice, currency), currency)}
        </span>
        {hasDiscount && (
          <span className="text-sm font-medium text-muted-foreground/40 line-through">
            {formatPrice(convertPrice(product.price, currency), currency)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full",
            stockStatus === "in_stock" && "bg-emerald-500",
            stockStatus === "low_stock" && "bg-orange-500",
            stockStatus === "out_of_stock" && "bg-red-500",
            stockStatus === "pre_order" && "bg-blue-500",
          )}
        />
        <span className={cn("text-[11px] font-medium", stockInfo.color)}>
          {stockInfo.label}
        </span>
      </div>
    </div>
  );
}
