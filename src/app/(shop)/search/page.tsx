"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search, X, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SearchResultsGrid,
  SearchLoadingSkeletons,
  SearchEmptyState,
  PriceSlider,
  RatingFilter,
  BrandFilter,
  CategoryFilter,
  ActiveFilters,
  SearchPagination,
  MobileFilterDrawer,
  PopularSearches,
  SearchHistory,
} from "@/components/search";
import type { ActiveFilter } from "@/components/search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Reviewed" },
  { value: "name_asc", label: "Name: A–Z" },
  { value: "name_desc", label: "Name: Z–A" },
];

function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("search-history");
      if (stored) setSearches(JSON.parse(stored));
    } catch {}
  }, []);

  const add = useCallback((q: string) => {
    setSearches((prev) => {
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, 10);
      localStorage.setItem("search-history", JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((q: string) => {
    setSearches((prev) => {
      const next = prev.filter((s) => s !== q);
      localStorage.setItem("search-history", JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSearches([]);
    localStorage.removeItem("search-history");
  }, []);

  return { searches, add, remove, clear };
}

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

  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filterCategories, setFilterCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [filterPriceRange, setFilterPriceRange] = useState<{ minPrice: number; maxPrice: number }>({ minPrice: 0, maxPrice: 0 });

  const { searches: recentSearches, add: addRecentSearch, remove: removeRecentSearch, clear: clearRecentSearches } = useRecentSearches();

  const updateURL = useCallback(
    (params: Record<string, string | undefined>) => {
      const next = new URLSearchParams();
      const q = params.q ?? sp.get("q") ?? "";
      const category = params.category ?? sp.get("category") ?? "";
      const brand = params.brand ?? sp.get("brand") ?? "";
      const minPrice = params.minPrice ?? sp.get("minPrice") ?? "";
      const maxPrice = params.maxPrice ?? sp.get("maxPrice") ?? "";
      const rating = params.rating ?? sp.get("rating") ?? "";
      const inStock = params.inStock ?? sp.get("inStock");
      const onSale = params.onSale ?? sp.get("onSale");
      const sortBy = params.sortBy ?? sp.get("sortBy") ?? "relevance";
      const page = params.page ?? sp.get("page") ?? "1";

      if (q) next.set("q", q);
      if (category) next.set("category", category);
      if (brand) next.set("brand", brand);
      if (minPrice.length > 0 && minPrice !== "0") {
        if (parseFloat(minPrice) > filterPriceRange.minPrice) next.set("minPrice", minPrice);
      }
      if (maxPrice.length > 0 && maxPrice !== "0") {
        if (parseFloat(maxPrice) < filterPriceRange.maxPrice) next.set("maxPrice", maxPrice);
      }
      if (rating) next.set("rating", rating);
      if (inStock === "true") next.set("inStock", "true");
      if (onSale === "true") next.set("onSale", "true");
      if (sortBy !== "relevance") next.set("sortBy", sortBy);
      if (page !== "1") next.set("page", page);

      const str = next.toString();
      router.replace(str ? `${pathname}?${str}` : pathname, { scroll: false });
    },
    [router, pathname, sp, filterPriceRange]
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
        setResults(data.results || []);
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
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-card border rounded-2xl p-6 sticky top-4 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Filters</h2>
                {activeFilters.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-7">
                    Reset
                  </Button>
                )}
              </div>

              <CategoryFilter categories={filterCategories} selected={category} onChange={(v) => setFilter("category", v)} />

              <BrandFilter
                brands={filterBrands}
                selected={brand ? brand.split(",").filter(Boolean) : []}
                onChange={(list) => setFilter("brand", list.join(","))}
              />

              <PriceSlider
                min={filterPriceRange.minPrice || 0}
                max={filterPriceRange.maxPrice || 10000}
                value={priceValue}
                onChange={([min, max]) => {
                  updateURL({
                    minPrice: String(min),
                    maxPrice: String(max),
                    page: "1",
                  });
                }}
              />

              <RatingFilter
                value={rating ? parseFloat(rating) : ""}
                onChange={(v) => setFilter("rating", v ? String(v) : "")}
              />

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setFilter("inStock", e.target.checked ? "true" : "")}
                    className="w-4 h-4 rounded border-input accent-primary"
                  />
                  <span className="text-sm font-medium">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onSale}
                    onChange={(e) => setFilter("onSale", e.target.checked ? "true" : "")}
                    className="w-4 h-4 rounded border-input accent-primary"
                  />
                  <span className="text-sm font-medium">On Sale</span>
                </label>
              </div>
            </div>
          </aside>

          <MobileFilterDrawer
            open={mobileFilterOpen}
            onOpenChange={setMobileFilterOpen}
            hasActiveFilters={activeFilters.length > 0}
            onApply={() => setMobileFilterOpen(false)}
            onReset={clearAllFilters}
          >
            <CategoryFilter categories={filterCategories} selected={category} onChange={(v) => setFilter("category", v)} />
            <BrandFilter
              brands={filterBrands}
              selected={brand ? brand.split(",").filter(Boolean) : []}
              onChange={(list) => setFilter("brand", list.join(","))}
            />
            <PriceSlider
              min={filterPriceRange.minPrice || 0}
              max={filterPriceRange.maxPrice || 10000}
              value={priceValue}
              onChange={([min, max]) => {
                updateURL({ minPrice: String(min), maxPrice: String(max), page: "1" });
              }}
            />
            <RatingFilter
              value={rating ? parseFloat(rating) : ""}
              onChange={(v) => setFilter("rating", v ? String(v) : "")}
            />
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setFilter("inStock", e.target.checked ? "true" : "")}
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-sm font-medium">In Stock Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={(e) => setFilter("onSale", e.target.checked ? "true" : "")}
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-sm font-medium">On Sale</span>
              </label>
            </div>
          </MobileFilterDrawer>

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
                  {activeFilters.length > 0 && (
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
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={cn("p-2 transition-colors", view === "list" ? "bg-primary text-white" : "hover:bg-muted")}
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
                hasActiveFilters={activeFilters.length > 0}
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
