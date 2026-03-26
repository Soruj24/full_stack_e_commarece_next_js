"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingCart, GitCompare } from "lucide-react";
import { QuickView } from "@/components/products/QuickView";
import { IProduct } from "@/types";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="relative aspect-square overflow-hidden rounded-t-2xl">
      <Image
        src={imgSrc}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        onError={() => setImgSrc(getFallbackImage(product.category?.slug))}
      />

      {/* Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg animate-pulse">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-destructive text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            {t("product.outOfStock")}
          </span>
        )}
        {hasDiscount && (
          <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Action Buttons Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:scale-110 transition-all duration-300 scale-0 group-hover:scale-100"
          aria-label={`Add ${product.name} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isInWishlist(product._id)
                ? "fill-red-500 text-red-500"
                : "text-gray-700",
            )}
          />
        </Button>
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
        />
        <Link href={`/products/${product._id}`} onClick={handleViewProduct}>
          <Button
            size="icon"
            variant="secondary"
            className="h-11 w-11 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:scale-110 transition-all duration-300 scale-0 group-hover:scale-100"
            aria-label={`View ${product.name} details`}
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
