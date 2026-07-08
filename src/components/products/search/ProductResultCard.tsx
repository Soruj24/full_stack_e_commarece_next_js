"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn, getFallbackImage } from "@/lib/utils";
import { SearchProduct } from "@/modules/search/types/product-search";

interface ProductResultCardProps {
  product: SearchProduct;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

export function ProductResultCard({ product, isSelected, onSelect, onHover }: ProductResultCardProps) {
  return (
    <Link
      href={`/products/${product._id}`}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all group/item",
        isSelected ? "bg-primary/10" : "hover:bg-primary/5",
      )}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-muted overflow-hidden border border-border/50 shrink-0 relative">
        <img
          src={product.images?.[0] || getFallbackImage(product.category?.slug)}
          alt=""
          className={cn("object-cover w-full h-full transition-transform duration-500", isSelected ? "scale-110" : "group-hover/item:scale-110")}
          onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(product.category?.slug); }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("font-bold text-xs sm:text-sm truncate transition-colors", isSelected ? "text-primary" : "group-hover/item:text-primary")}>
          {product.name}
        </p>
        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary">${product.price}</span>
          <span className="text-[9px] sm:text-[10px] text-muted-foreground/40">•</span>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">
            {product.category?.name || "Unknown"}
          </span>
        </div>
      </div>
      <ArrowRight
        className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary transition-all", isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0")}
      />
    </Link>
  );
}
