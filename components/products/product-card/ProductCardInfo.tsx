"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, convertPrice } from "@/lib/localization";
import { StockIndicator } from "@/components/products/StockStatus";

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
  return (
    <div className="p-6 space-y-4">
      <div>
        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
          >
            {product.category.name}
          </Link>
        )}
        <h3 className="font-black text-lg line-clamp-1 group-hover:text-primary transition-colors">
          <Link
            href={`/products/${product._id}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
          {product.brand}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-primary/5 px-2 py-1 rounded-lg">
          <Star className="w-3 h-3 fill-primary text-primary" />
          <span className="text-xs font-black ml-1 text-primary">
            {(product.rating || 0).toFixed(1)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          ({product.numReviews} Reviews)
        </span>
      </div>

      <div className="flex items-end justify-between pt-2">
        <div className="flex flex-col">
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through font-bold">
              {formatPrice(convertPrice(product.price, currency), currency)}
            </span>
          )}
          <span className="text-2xl font-black tracking-tight text-foreground">
            {formatPrice(convertPrice(currentPrice, currency), currency)}
          </span>
        </div>
        <Button
          variant="premium"
          className="rounded-2xl font-black text-xs h-10 px-4 gap-2 shadow-lg shadow-primary/10 group/btn"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
      </div>

      <StockIndicator stock={product.stock} className="mt-2" />
    </div>
  );
}
