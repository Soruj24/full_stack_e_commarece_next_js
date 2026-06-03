"use client";

import { Loader2 } from "lucide-react";
import type { IProduct } from "@/types";
import { useRelatedProducts } from "@/hooks/use-related-products";
import { RelatedProductsHeader } from "./related-products/RelatedProductsHeader";
import { RelatedProductCard } from "./related-products/RelatedProductCard";

interface RelatedProductsProps {
  productId?: string;
  category?: string;
  currentProduct?: IProduct;
  maxItems?: number;
  title?: string;
}

export function RelatedProducts({ productId, category, maxItems = 8, title = "You May Also Like" }: RelatedProductsProps) {
  const { products, loading, isHovered, setIsHovered, scrollContainerRef, scroll, handleQuickAddToCart, handleToggleWishlist, isInWishlist } = useRelatedProducts(productId, category, maxItems);

  if (loading) return <div className="py-8"><div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></div>;
  if (products.length === 0) return null;

  return (
    <div className="py-8">
      <RelatedProductsHeader title={title} count={products.length} onScroll={scroll} />

      <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {products.map((product, index) => (
          <RelatedProductCard
            key={product._id}
            product={product}
            index={index}
            isHovered={isHovered === product._id}
            inWishlist={isInWishlist(product._id)}
            onHover={setIsHovered}
            onAddToCart={handleQuickAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />
        ))}
      </div>
    </div>
  );
}
