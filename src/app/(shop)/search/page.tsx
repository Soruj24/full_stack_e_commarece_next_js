"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecentSearches } from "@/modules/search";
import {
  SearchResultsGrid,
  SearchLoadingSkeletons,
  SearchEmptyState,
  SearchFiltersPanel,
  ActiveFilters,
  SearchPagination,
  PopularSearches,
  SearchHistory,
} from "@/components/search";
import type { ActiveFilter } from "@/components/search";
import type { IProduct } from "@/shared/types";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Reviewed" },
  { value: "name_asc", label: "Name: A\u2013Z" },
  { value: "name_desc", label: "Name: Z\u2013A" },
];

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const q = sp.get("q") || "";
  const category = sp.get("category") || "";
  const brand = sp.get("brand") || "";
  const minPrice = sp.get("minPrice") || "";
  const maxPrice = sp.get("maxPrice") || "";
  const rating = sp.get("rating") || "";
  const inStock = sp.get("inStock") === "true";
  const onSale = sp.get("onSale") === "true";
  const sortBy = sp.get("sortBy") || "relevance";
  const page = parseInt(sp.get("page") || "1");

  const [localQuery, setLocalQuery] = useState(q);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [results, setResults] = useState<IProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filterCategories, setFilterCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [filterPriceRange, setFilterPriceRange] = useState({ minPrice: 0, maxPrice: 0 });

  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();

  const updateURL = useCallback(
    (overrides: Record<string, string | undefined | boolean>) => {
      const next = new URLSearchParams();
      const qVal = overrides.q !== undefined ? String(overrides.q) : sp.get("q") || "";
      const catVal = overrides.category !== undefined ? String(overrides.category) : sp.get("category") || "";
      const brandVal = overrides.brand !== undefined ? String(overrides.brand) : sp.get("brand") || "";
      const minP = overrides.minPrice !== undefined ? String(overrides.minPrice) : sp.get("minPrice") || "";
      const maxP = overrides.maxPrice !== undefined ? String(overrides.maxPrice) : sp.get("maxPrice") || "";
      const rateVal = overrides.rating !== undefined ? String(overrides.rating) : sp.get("rating") || "";
      const inStockVal = overrides.inStock ?? sp.get("inStock");
      const onSaleVal = overrides.onSale ?? sp.get("onSale");
      const sortVal = overrides.sortBy !== undefined ? String(overrides.sortBy) : sp.get("sortBy") || "relevance";
      const pageVal = overrides.page !== undefined ? String(overrides.page) : sp.get("page") || "1";

      if (qVal) next.set("q", qVal);
      if (catVal) next.set("category", catVal);
      if (brandVal) next.set("brand", brandVal);
      if (minP) next.set("minPrice", minP);
      if (maxP) next.set("maxPrice", maxP);
      if (rateVal) next.set("rating", rateVal);
      if (inStockVal === true || inStockVal === "true") next.set("inStock", "true");
      if (onSaleVal === true || onSaleVal === "true") next.set("onSale", "true");
      if (sortVal && sortVal !== "relevance") next.set("sortBy", sortVal);
      if (pageVal && pageVal !== "1") next.set("page", pageVal);

      router.replace(next.toString() ? `${pathname}?${next.toString()}` : pathname, { scroll: false });
    },
    [router, pathname, sp]
  );

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const qVal = sp.get("q") || "";
      const catVal = sp.get("category") || "";
      const brandVal = sp.get("brand") || "";
      const minPriceVal = sp.get("minPrice") || "";
      const maxPriceVal = sp.get("maxPrice") || "";
      const ratingVal = sp.get("rating") || "";
      const inStockVal = sp.get("inStock") === "true";
      const onSaleVal = sp.get("onSale") === "true";
      const sortByVal = sp.get("sortBy") || "relevance";
      const pageVal = parseInt(sp.get("page") || "1");

      if (qVal) params.set("q", qVal);
      if (catVal) params.set("category", catVal);
      if (brandVal) params.set("brand", brandVal);
      if (minPriceVal) params.set("minPrice", minPriceVal);
      if (maxPriceVal) params.set("maxPrice", maxPriceVal);
      if (ratingVal) params.set("rating", ratingVal);
      if (inStockVal) params.set("inStock", "true");
      if (onSaleVal) params.set("onSale", "true");
      if (sortByVal && sortByVal !== "relevance") params.set("sortBy", sortByVal);
      if (pageVal > 1) params.set("page", String(pageVal));

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResults((data.results || []) as IProduct[]);
        setTotal(data.pagination?.total || 0);
        setPages(data.pagination?.pages || 0);
        if (data.filters) {
          if (data.filters.categories) setFilterCategories(data.filters.categories);
          if (data.filters.brands) setFilterBrands(data.filters.brands);
          if (data.filters.priceRange) setFilterPriceRange(data.filters.priceRange);
        }
        if (qVal) addRecentSearch(qVal);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [sp, addRecentSearch]);

  useEffect(() => {
    debounceRef.current = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceRef.current);
  }, [performSearch]);

  useEffect(() => {
    setLocalQuery(q);
  }, [q]);

  const setFilter = useCallback(
    (key: string, value: string) => {
      updateURL({ [key]: value || undefined, page: "1" });
    },
    [updateURL]
  );

  const removeFilter = useCallback(
    (key: string) => {
      updateURL({ [key]: undefined, page: "1" });
    },
    [updateURL]
  );

  const clearAllFilters = useCallback(() => {
    updateURL({
      category: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      inStock: undefined,
      onSale: undefined,
      page: "1",
    });
  }, [updateURL]);

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const list: ActiveFilter[] = [];
    if (category) {
      const cat = filterCategories.find((c) => c.slug === category);
      list.push({ key: "category", label: "Category", value: cat?.name || category });
    }
    if (brand) list.push({ key: "brand", label: "Brand", value: brand });
    if (minPrice) list.push({ key: "minPrice", label: "Min Price", value: `$${minPrice}` });
    if (maxPrice) list.push({ key: "maxPrice", label: "Max Price", value: `$${maxPrice}` });
    if (rating) list.push({ key: "rating", label: "Rating", value: `${rating}+` });
    if (inStock) list.push({ key: "inStock", label: "In Stock", value: "Yes" });
    if (onSale) list.push({ key: "onSale", label: "On Sale", value: "Yes" });
    return list;
  }, [category, brand, minPrice, maxPrice, rating, inStock, onSale, filterCategories]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateURL({ q: localQuery, page: "1" });
    },
    [localQuery, updateURL]
  );

  const handlePopularSearch = useCallback(
    (query: string) => {
      setLocalQuery(query);
      updateURL({ q: query, page: "1" });
    },
    [updateURL]
  );

  const priceValue = useMemo<[number, number]>(() => {
    const min = minPrice ? parseFloat(minPrice) : filterPriceRange.minPrice;
    const max = maxPrice ? parseFloat(maxPrice) : filterPriceRange.maxPrice;
    return [min || 0, max || filterPriceRange.maxPrice || 10000];
  }, [minPrice, maxPrice, filterPriceRange]);

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="pl-12 pr-10 h-14 text-lg rounded-2xl bg-background border-2 focus-visible:border-primary shadow-sm"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalQuery("");
                    if (q) updateURL({ q: undefined, page: "1" });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
          {!q && (
            <div className="max-w-2xl mx-auto mt-4 space-y-3">
              <SearchHistory
                searches={recentSearches}
                onSelect={handlePopularSearch}
                onClear={clearRecentSearches}
                onRemove={removeRecentSearch}
              />
              <PopularSearches onSelect={handlePopularSearch} />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <SearchFiltersPanel
            categories={filterCategories}
            brands={filterBrands}
            priceRange={filterPriceRange}
            priceValue={priceValue}
            selectedCategory={category}
            selectedBrands={brand ? brand.split(",").filter(Boolean) : []}
            selectedRating={rating ? parseFloat(rating) : ""}
            inStock={inStock}
            onSale={onSale}
            activeFilterCount={activeFilters.length}
            mobileFilterOpen={mobileFilterOpen}
            onMobileFilterOpenChange={setMobileFilterOpen}
            onCategoryChange={(v) => setFilter("category", v)}
            onBrandChange={(list) => setFilter("brand", list.join(","))}
            onPriceChange={([min, max]) => {
              updateURL({ minPrice: String(min), maxPrice: String(max), page: "1" });
            }}
            onRatingChange={(v) => setFilter("rating", v ? String(v) : "")}
            onInStockChange={(checked) => setFilter("inStock", checked ? "true" : "")}
            onOnSaleChange={(checked) => setFilter("onSale", checked ? "true" : "")}
            onClearAll={clearAllFilters}
          />

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileFilterOpen(true)}
                  className="md:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {activeFilters.length}
                    </span>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {loading ? (
                    "Searching..."
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{total}</span> result
                      {total !== 1 ? "s" : ""}
                      {q && (
                        <>
                          {" "}for &quot;<span className="text-foreground">{q}</span>&quot;
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={cn("p-2 transition-colors", view === "grid" ? "bg-primary text-white" : "hover:bg-muted")}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={cn("p-2 transition-colors", view === "list" ? "bg-primary text-white" : "hover:bg-muted")}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <Select
                  value={sortBy}
                  onValueChange={(v) => updateURL({ sortBy: v, page: "1" })}
                >
                  <SelectTrigger className="w-36 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ActiveFilters filters={activeFilters} onRemove={removeFilter} onClearAll={clearAllFilters} />

            {loading ? (
              <SearchLoadingSkeletons count={6} />
            ) : results.length > 0 ? (
              <SearchResultsGrid results={results} view={view} />
            ) : (
              <SearchEmptyState
                query={q}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={clearAllFilters}
              />
            )}

            <SearchPagination
              page={page}
              pages={pages}
              onPageChange={(p) => updateURL({ page: String(p) })}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
