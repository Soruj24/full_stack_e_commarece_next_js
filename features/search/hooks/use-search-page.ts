import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IProduct, ICategory } from "@/types";

interface Brand {
  _id: string;
  slug: string;
  name: string;
}

export interface FiltersState {
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  inStock: boolean;
}

interface SearchPageProps {
  searchParams: { q?: string; category?: string; brand?: string };
}

export function useSearchPage(searchParams: SearchPageProps["searchParams"]) {
  const params = useSearchParams();
  const [query, setQuery] = useState(searchParams.q || "");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<IProduct[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState<FiltersState>({
    category: searchParams.category || "", brand: searchParams.brand || "",
    minPrice: "", maxPrice: "", rating: "", inStock: false,
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([fetch("/api/categories"), fetch("/api/brands")]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        if (catData.categories) setCategories(catData.categories);
        if (brandData.success) setBrands(brandData.brands || []);
      } catch (error) { console.error("Failed to fetch filters:", error); }
    };
    fetchFilters();
  }, []);

  const performSearch = async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (query) sp.set("q", query);
      if (filters.category) sp.set("category", filters.category);
      if (filters.brand) sp.set("brand", filters.brand);
      if (filters.minPrice) sp.set("minPrice", filters.minPrice);
      if (filters.maxPrice) sp.set("maxPrice", filters.maxPrice);
      if (filters.rating) sp.set("rating", filters.rating);
      if (filters.inStock) sp.set("inStock", "true");
      sp.set("sortBy", sortBy);
      const res = await fetch(`/api/search?${sp.toString()}`);
      const data = await res.json();
      if (data.success) { setResults(data.results || []); setTotalResults(data.total || 0); }
    } catch (error) { console.error("Search failed:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => performSearch(), 300);
    return () => clearTimeout(timer);
  }, [query, filters, sortBy]);

  const resetFilters = () => {
    setFilters({ category: "", brand: "", minPrice: "", maxPrice: "", rating: "", inStock: false });
    setSortBy("relevance");
  };

  const hasActiveFilters = Boolean(filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.rating || filters.inStock);

  return { query, setQuery, view, setView, showFilters, setShowFilters, results, totalResults, loading, sortBy, setSortBy, filters, setFilters, categories, brands, resetFilters, hasActiveFilters };
}
