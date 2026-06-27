"use client";

import Link from "next/link";
import { ArrowRight, Tag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SearchSuggestions } from "@/features/search/types/product-search";
import { ProductResultCard } from "./ProductResultCard";

interface SearchResultsProps {
  suggestions: SearchSuggestions;
  selectedIndex: number;
  filterCount: number;
  categoryCount: number;
  onSelect: (index: number) => void;
  onItemClick: (name: string) => void;
  onClear: () => void;
}

export function SearchResults({
  suggestions, selectedIndex, filterCount, categoryCount,
  onSelect, onItemClick, onClear,
}: SearchResultsProps) {
  const hasCategories = (suggestions.categories?.length ?? 0) > 0;
  const hasProducts = (suggestions.products?.length ?? 0) > 0;
  const hasNoResults = !hasCategories && !hasProducts;

  return (
    <>
      {hasCategories && (
        <div className="space-y-2 sm:space-y-3">
          <h4 className="px-1 sm:px-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sectors</h4>
          <div className="grid grid-cols-1 gap-1">
            {suggestions.categories?.map((cat, i) => {
              const globalIndex = filterCount + i;
              const isSelected = selectedIndex === globalIndex;
              return (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  onMouseEnter={() => onSelect(globalIndex)}
                  onClick={() => onItemClick("")}
                  className={cn("flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all group/item", isSelected ? "bg-primary/10" : "hover:bg-primary/5")}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className={cn("p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-colors", isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                      <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className={cn("font-bold text-xs sm:text-sm", isSelected ? "text-primary" : "")}>{cat.name}</span>
                  </div>
                  <ArrowRight className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary transition-all", isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0")} />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {hasProducts && (
        <div className="space-y-2 sm:space-y-3">
          <h4 className="px-1 sm:px-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Identified Assets</h4>
          <div className="grid grid-cols-1 gap-1">
            {suggestions.products?.map((product, i) => {
              const globalIndex = filterCount + categoryCount + i;
              return (
                <ProductResultCard
                  key={product._id}
                  product={product}
                  isSelected={selectedIndex === globalIndex}
                  onSelect={() => onItemClick(product.name)}
                  onHover={() => onSelect(globalIndex)}
                />
              );
            })}
          </div>
        </div>
      )}

      {hasNoResults && (
        <div className="py-8 sm:py-12 text-center space-y-4 sm:space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] sm:rounded-[32px] bg-muted flex items-center justify-center mx-auto relative group">
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/40 relative z-10" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="font-black uppercase tracking-tighter text-xl sm:text-2xl italic">Zero Matches Detected</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] max-w-[200px] sm:max-w-[240px] mx-auto leading-relaxed">
              Our systems could not locate any assets matching your current parameters.
            </p>
          </div>
          <Button variant="outline" onClick={onClear} className="rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] h-10 sm:h-12 px-6 sm:px-8 border-primary/20 hover:bg-primary hover:text-white transition-all duration-500">
            Clear Search Protocol
          </Button>
        </div>
      )}
    </>
  );
}
