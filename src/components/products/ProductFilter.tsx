"use client";

import { useState, useEffect } from "react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

import { FilterHeader } from "./filters/FilterHeader";
import { CategoryFilter } from "./filters/CategoryFilter";
import { BrandFilter } from "./filters/BrandFilter";
import { PriceFilter } from "./filters/PriceFilter";
import { RatingFilter } from "./filters/RatingFilter";
import { AvailabilityFilter } from "./filters/AvailabilityFilter";

interface ProductFilterProps {
  onFilterChange: (filters: Record<string, string>) => void;
  categories: { _id: string; name: string; slug: string }[];
  initialFilters: Record<string, string>;
}

const POPULAR_BRANDS = [
  "TechNova",
  "UrbanStyle",
  "GreenLife",
  "BuildMaster",
  "KitchenPro",
  "GamerX",
  "SoundWave",
  "Visionary",
  "DecorArt",
  "SpeedDemon",
];

function FilterContent({
  keyword,
  setKeyword,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  selectedBrands,
  toggleBrand,
  minRating,
  setMinRating,
  inStock,
  setInStock,
  clearAll,
  categories,
}: {
  keyword: string;
  setKeyword: (v: string) => void;
  selectedCategories: string[];
  toggleCategory: (slug: string) => void;
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  inStock: boolean;
  setInStock: (v: boolean) => void;
  clearAll: () => void;
  categories: { _id: string; name: string; slug: string }[];
}) {
  return (
    <>
      <FilterHeader
        activeCount={0}
        keyword={keyword}
        setKeyword={setKeyword}
      />

      <ScrollArea className="h-[calc(100vh-300px)] px-6">
        <div className="py-6 space-y-6">
          <Accordion
            type="multiple"
            defaultValue={["categories", "price", "brands"]}
            className="w-full"
          >
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />

            <PriceFilter
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />

            <BrandFilter
              brands={POPULAR_BRANDS}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
            />

            <RatingFilter minRating={minRating} setMinRating={setMinRating} />

            <AvailabilityFilter inStock={inStock} setInStock={setInStock} />
          </Accordion>
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border/40 bg-muted/20 backdrop-blur-md">
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl border-border/50 hover:bg-destructive hover:text-white hover:border-destructive font-bold text-xs uppercase tracking-widest gap-2 transition-all shadow-sm"
          onClick={clearAll}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </Button>
      </div>
    </>
  );
}

export function ProductFilter({
  onFilterChange,
  categories,
  initialFilters,
}: ProductFilterProps) {
  const [keyword, setKeyword] = useState(initialFilters.keyword || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters.category ? initialFilters.category.split(",") : [],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialFilters.brand ? initialFilters.brand.split(",") : [],
  );
  const [priceRange, setPriceRange] = useState([
    parseInt(initialFilters.minPrice) || 0,
    parseInt(initialFilters.maxPrice) || 2000,
  ]);
  const [minRating, setMinRating] = useState(
    parseInt(initialFilters.rating) || 0,
  );
  const [inStock, setInStock] = useState(initialFilters.inStock === "true");

  const [prevInitialFilters, setPrevInitialFilters] = useState(initialFilters);

  if (initialFilters !== prevInitialFilters) {
    setPrevInitialFilters(initialFilters);

    const newKeyword = initialFilters.keyword || "";
    if (keyword !== newKeyword) setKeyword(newKeyword);

    const newCategoriesString = initialFilters.category || "";
    if (selectedCategories.join(",") !== newCategoriesString) {
      setSelectedCategories(
        newCategoriesString ? newCategoriesString.split(",") : [],
      );
    }

    const newBrandsString = initialFilters.brand || "";
    if (selectedBrands.join(",") !== newBrandsString) {
      setSelectedBrands(newBrandsString ? newBrandsString.split(",") : []);
    }

    const newMinPrice = parseInt(initialFilters.minPrice) || 0;
    const newMaxPrice = parseInt(initialFilters.maxPrice) || 2000;
    if (priceRange[0] !== newMinPrice || priceRange[1] !== newMaxPrice) {
      setPriceRange([newMinPrice, newMaxPrice]);
    }

    const newRating = parseInt(initialFilters.rating) || 0;
    if (minRating !== newRating) setMinRating(newRating);

    const newInStock = initialFilters.inStock === "true";
    if (inStock !== newInStock) setInStock(newInStock);
  }

  const applyFilters = () => {
    const currentCategory = selectedCategories.join(",");
    const currentBrand = selectedBrands.join(",");
    const currentInStock = inStock ? "true" : "false";

    if (
      keyword === (initialFilters.keyword || "") &&
      currentCategory === (initialFilters.category || "") &&
      currentBrand === (initialFilters.brand || "") &&
      priceRange[0] === (parseInt(initialFilters.minPrice) || 0) &&
      priceRange[1] === (parseInt(initialFilters.maxPrice) || 2000) &&
      minRating === (parseInt(initialFilters.rating) || 0) &&
      currentInStock === (initialFilters.inStock || "false")
    ) {
      return;
    }

    onFilterChange({
      keyword,
      category: currentCategory,
      brand: currentBrand,
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      rating: minRating.toString(),
      inStock: currentInStock,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);
    return () => clearTimeout(timer);
  }, [
    keyword,
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    inStock,
  ]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearAll = () => {
    setKeyword("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
    setMinRating(0);
    setInStock(false);
    onFilterChange({
      keyword: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      inStock: "false",
    });
  };

  const activeFiltersCount = [
    keyword,
    selectedCategories.length > 0,
    selectedBrands.length > 0,
    priceRange[0] > 0 || priceRange[1] < 2000,
    minRating > 0,
    inStock,
  ].filter(Boolean).length;

  const filterProps = {
    keyword,
    setKeyword,
    selectedCategories,
    toggleCategory,
    priceRange,
    setPriceRange,
    selectedBrands,
    toggleBrand,
    minRating,
    setMinRating,
    inStock,
    setInStock,
    clearAll,
    categories,
  };

  return (
    <>
      {/* Desktop: inline sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block bg-card/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 rounded-[24px] border border-border/40 shadow-xl shadow-primary/5 overflow-hidden sticky top-24"
      >
        <FilterContent {...filterProps} />
      </motion.div>

      {/* Mobile: Sheet drawer */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 h-10 font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[85vh] rounded-t-3xl p-0"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/30">
              <SheetTitle className="text-lg font-bold flex items-center justify-between">
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <FilterContent {...filterProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
