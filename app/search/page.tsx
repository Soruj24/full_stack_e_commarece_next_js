"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  SearchPageHero,
  SearchFiltersSidebar,
  SearchResultsToolbar,
  SearchResultsGrid,
  SearchLoadingSkeletons,
  SearchEmptyState,
  FiltersState,
} from "@/components/search";
import { IProduct, ICategory } from "@/types";

interface SearchPageProps {
  searchParams: { q?: string; category?: string; brand?: string };
}

interface Brand {
  _id: string;
  slug: string;
  name: string;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const params = useSearchParams();
  const [query, setQuery] = useState(searchParams.q || "");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<IProduct[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState<FiltersState>({
    category: searchParams.category || "",
    brand: searchParams.brand || "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    inStock: false,
  });

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        if (catData.categories) setCategories(catData.categories);
        if (brandData.success) setBrands(brandData.brands || []);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };
    fetchFilters();
  }, []);

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchParamsObj = new URLSearchParams();
      if (query) searchParamsObj.set("q", query);
      if (filters.category) searchParamsObj.set("category", filters.category);
      if (filters.brand) searchParamsObj.set("brand", filters.brand);
      if (filters.minPrice) searchParamsObj.set("minPrice", filters.minPrice);
      if (filters.maxPrice) searchParamsObj.set("maxPrice", filters.maxPrice);
      if (filters.rating) searchParamsObj.set("rating", filters.rating);
      if (filters.inStock) searchParamsObj.set("inStock", "true");
      searchParamsObj.set("sortBy", sortBy);

      const res = await fetch(`/api/search?${searchParamsObj.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setTotalResults(data.total || 0);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, filters, sortBy]);

  const resetFilters = () => {
    setFilters({
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      inStock: false,
    });
    setSortBy("relevance");
  };

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.rating ||
    filters.inStock
  );

  return (
    <div className="min-h-screen pb-20">
      <SearchPageHero />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <SearchFiltersSidebar
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            brands={brands}
            showFilters={showFilters}
          />

          <main className="flex-1">
            <SearchResultsToolbar
              query={query}
              totalResults={totalResults}
              loading={loading}
              view={view}
              onViewChange={setView}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              hasActiveFilters={hasActiveFilters}
            />

            {loading ? (
              <SearchLoadingSkeletons count={6} />
            ) : results.length > 0 ? (
              <SearchResultsGrid results={results} view={view} />
            ) : (
              <SearchEmptyState
                query={query}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={resetFilters}
              />
            )}

            {totalResults > 20 && (
              <SearchPagination totalResults={totalResults} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SearchPagination({
  totalResults,
}: {
  totalResults: number;
}) {
  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <span className="px-4 py-2 text-sm">
          Page 1 of {Math.ceil(totalResults / 20)}
        </span>
        <Button variant="outline" disabled>
          Next
        </Button>
      </div>
    </div>
  );
}
