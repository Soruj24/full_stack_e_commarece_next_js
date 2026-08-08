"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { QuickView } from "@/components/products/QuickView";
import { IProduct } from "@/shared/types";
import { cn, getFallbackImage } from "@/lib/utils";
import { CompareButton } from "@/components/products/CompareProducts";

interface ProductCardImageProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    stock: number;
    category: { name: string; slug: string };
    brand?: string;
    rating?: number;
    numReviews?: number;
  };
  imgSrc: string;
  setImgSrc: (src: string) => void;
  hasDiscount: boolean;
  discountPercentage: number;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  handleAddToCart: (e: React.MouseEvent) => void;
  handleViewProduct: () => void;
  t: (key: string) => string;
}

export function ProductCardImage({
  product,
  imgSrc,
  setImgSrc,
  hasDiscount,
  discountPercentage,
  isInWishlist,
  toggleWishlist,
  handleAddToCart,
  handleViewProduct,
  t,
}: ProductCardImageProps) {
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="relative aspect-square overflow-hidden bg-muted/30">
      {/* Product Image */}
      <Link href={`/products/${product._id}`} onClick={handleViewProduct}>
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImgSrc(getFallbackImage(product.category?.slug))}
        />
      </Link>

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Badges — top left */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        {hasDiscount && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-semibold tracking-wide shadow-sm">
            -{discountPercentage}%
          </span>
        )}
        {outOfStock && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-destructive/90 text-white text-[10px] font-semibold tracking-wide shadow-sm">
            {t("product.outOfStock")}
          </span>
        )}
        {lowStock && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-500/90 text-white text-[10px] font-semibold tracking-wide shadow-sm">
            Low Stock
          </span>
        )}
      </div>

      {/* Favorite button — top right */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
        className={cn(
          "absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full",
          "bg-white/80 dark:bg-black/40 backdrop-blur-sm",
          "border border-black/[0.06] dark:border-white/[0.1]",
          "shadow-sm transition-all duration-200",
          "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0",
          "hover:bg-white dark:hover:bg-black/60 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        )}
        aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-colors duration-200",
            isInWishlist(product._id)
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground",
          )}
          strokeWidth={2}
        />
      </button>

      {/* Action buttons — bottom center, reveal on hover */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-2 pb-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
        {/* Quick View */}
        <QuickView
          product={product as IProduct}
          trigger={
            <button
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-full",
                "bg-white/90 dark:bg-black/50 backdrop-blur-sm",
                "border border-black/[0.06] dark:border-white/[0.1]",
                "shadow-sm text-foreground",
                "text-[11px] font-medium",
                "hover:bg-white dark:hover:bg-black/70 hover:shadow-md",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              )}
              aria-label={`Quick view ${product.name}`}
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={2} />
              Quick View
            </button>
          }
        />

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 rounded-full",
            "bg-foreground text-background",
            "shadow-sm",
            "text-[11px] font-medium",
            "hover:shadow-md hover:scale-[1.02]",
            "transition-all duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          )}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
          {outOfStock ? "Sold Out" : "Add to Cart"}
        </button>

        {/* Compare */}
        <div className="[&>button]:flex [&>button]:items-center [&>button]:gap-1.5 [&>button]:px-3.5 [&>button]:py-2 [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:dark:bg-black/50 [&>button]:backdrop-blur-sm [&>button]:border [&>button]:border-black/[0.06] [&>button]:dark:border-white/[0.1] [&>button]:shadow-sm [&>button]:text-foreground [&>button]:text-[11px] [&>button]:font-medium [&>button]:hover:bg-white [&>button]:dark:hover:bg-black/70 [&>button]:hover:shadow-md [&>button]:transition-all [&>button]:duration-200 [&>button]:focus-visible:outline-none [&>button]:focus-visible:ring-2 [&>button]:focus-visible:ring-primary/30">
          <CompareButton
            variant="icon"
            product={{
              _id: product._id,
              name: product.name,
              price: product.price,
              images: product.images,
              category: product.category,
              brand: product.brand,
              stock: product.stock,
              rating: product.rating,
              numReviews: product.numReviews,
            }}
            className="!w-auto !h-auto !rounded-full !p-2 !bg-white/80 dark:!bg-black/40 !border !border-black/[0.06] dark:!border-white/[0.1] !shadow-sm hover:!bg-white dark:hover:!bg-black/60 hover:!shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
