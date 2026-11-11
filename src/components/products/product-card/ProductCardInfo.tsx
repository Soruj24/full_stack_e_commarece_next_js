"use client";

import Link from "next/link";
import { formatPrice, convertPrice } from "@/lib/localization";
import { useStock } from "@/modules/cart/context/StockContext";
import { cn } from "@/lib/utils";
import { ProductRating } from "@/components/products/ProductRating";

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
    in_stock: { label: "In Stock", color: "text-success" },
    low_stock: { label: `Only ${product.stock} left`, color: "text-warning" },
    out_of_stock: { label: "Out of Stock", color: "text-destructive" },
    pre_order: { label: "Pre-order", color: "text-primary" },
  };

  const stockInfo = stockConfig[stockStatus];

  return (
    <div className="p-4 space-y-3">
      <Link
        href={`/products?category=${product.category.slug}`}
        className="inline-block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        {product.category.name}
      </Link>

      <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
        <Link
          href={`/products/${product._id}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 rounded-sm"
        >
          {product.name}
        </Link>
      </h3>

      {product.brand && (
        <p className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
          {product.brand}
        </p>
      )}

      {product.numReviews > 0 && (
        <ProductRating
          rating={product.rating}
          count={product.numReviews}
          size="sm"
          className="[&_span]:text-[11px]"
        />
      )}

      <div className="flex items-baseline gap-2 pt-1">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {formatPrice(convertPrice(currentPrice, currency), currency)}
        </span>
        {hasDiscount && (
          <span className="text-sm font-medium text-muted-foreground/50 line-through">
            {formatPrice(convertPrice(product.price, currency), currency)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full",
            stockStatus === "in_stock" && "bg-success",
            stockStatus === "low_stock" && "bg-warning",
            stockStatus === "out_of_stock" && "bg-destructive",
            stockStatus === "pre_order" && "bg-primary",
          )}
        />
        <span className={cn("text-[11px] font-medium", stockInfo.color)}>
          {stockInfo.label}
        </span>
      </div>
    </div>
  );
}
