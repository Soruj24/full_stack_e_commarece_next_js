"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryFilter } from "./CategoryFilter";
import { BrandFilter } from "./BrandFilter";
import { PriceSlider } from "./PriceSlider";
import { RatingFilter } from "./RatingFilter";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface SearchFiltersPanelProps {
  categories: Category[];
  brands: string[];
  priceRange: { minPrice: number; maxPrice: number };
  priceValue: [number, number];
  selectedCategory: string;
  selectedBrands: string[];
  selectedRating: number | "";
  inStock: boolean;
  onSale: boolean;
  activeFilterCount: number;
  mobileFilterOpen: boolean;
  onMobileFilterOpenChange: (open: boolean) => void;
  onCategoryChange: (slug: string) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceChange: (value: [number, number]) => void;
  onRatingChange: (value: number | "") => void;
  onInStockChange: (checked: boolean) => void;
  onOnSaleChange: (checked: boolean) => void;
  onClearAll: () => void;
}

export function SearchFiltersPanel({
  categories,
  brands,
  priceRange,
  priceValue,
  selectedCategory,
  selectedBrands,
  selectedRating,
  inStock,
  onSale,
  activeFilterCount,
  mobileFilterOpen,
  onMobileFilterOpenChange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onRatingChange,
  onInStockChange,
  onOnSaleChange,
  onClearAll,
}: SearchFiltersPanelProps) {
  const filtersContent = (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <CategoryFilter categories={categories} selected={selectedCategory} onChange={onCategoryChange} />

      <BrandFilter
        brands={brands}
        selected={selectedBrands}
        onChange={onBrandChange}
      />

      <PriceSlider
        min={priceRange.minPrice || 0}
        max={priceRange.maxPrice || 10000}
        value={priceValue}
        onChange={onPriceChange}
      />

      <RatingFilter value={selectedRating} onChange={onRatingChange} />

      <div className="space-y-3 pt-2 border-t">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded border-input accent-primary transition-colors"
          />
          <span className="text-sm font-medium group-hover:text-primary transition-colors">In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => onOnSaleChange(e.target.checked)}
            className="w-4 h-4 rounded border-input accent-primary transition-colors"
          />
          <span className="text-sm font-medium group-hover:text-primary transition-colors">On Sale</span>
        </label>
      </div>
    </motion.div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-card border rounded-2xl p-6 sticky top-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Filters</h2>
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs h-7">
                    Reset
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {filtersContent}
        </div>
      </aside>

      <Sheet open={mobileFilterOpen} onOpenChange={onMobileFilterOpenChange}>
        <SheetContent side="left" size="lg" className="flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-2 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>Filters</SheetTitle>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs h-7">
                  Reset
                </Button>
              )}
            </div>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6">
            <div className="py-4">{filtersContent}</div>
          </ScrollArea>
          <SheetFooter className="px-6 pb-6 pt-2 border-t">
            <div className="flex gap-2 w-full">
              <SheetClose asChild>
                <Button className="flex-1" size="lg">
                  Apply Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-primary-foreground/20 text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
