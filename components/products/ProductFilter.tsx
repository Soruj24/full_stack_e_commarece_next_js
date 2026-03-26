"use client";

import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

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

export function ProductFilter({
  onFilterChange,
  categories,
  initialFilters,
}: ProductFilterProps) {
  // State
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

  // Sync state with initialFilters during render to avoid cascading renders in useEffect
  const [prevInitialFilters, setPrevInitialFilters] = useState(initialFilters);

  if (initialFilters !== prevInitialFilters) {
    setPrevInitialFilters(initialFilters);

    const newKeyword = initialFilters.keyword || "";
    if (keyword !== newKeyword) {
      setKeyword(newKeyword);
    }

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
    if (minRating !== newRating) {
      setMinRating(newRating);
    }

    const newInStock = initialFilters.inStock === "true";
    if (inStock !== newInStock) {
      setInStock(newInStock);
    }
  }

  const applyFilters = () => {
    const currentCategory = selectedCategories.join(",");
    const currentBrand = selectedBrands.join(",");
    const currentInStock = inStock ? "true" : "false";

    // Check if filters actually changed from initial values to prevent infinite loops
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

  // Debounce and Apply Filters
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 rounded-[24px] border border-border/40 shadow-xl shadow-primary/5 overflow-hidden sticky top-24"
    >
      <FilterHeader
        activeCount={activeFiltersCount}
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
    </motion.div>
  );
}
