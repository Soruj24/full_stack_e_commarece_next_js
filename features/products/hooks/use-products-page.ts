import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const currentFilters = useMemo(() => ({
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    rating: searchParams.get("rating") || "",
    sortBy: searchParams.get("sortBy") || "newest",
    page: searchParams.get("page") || "1",
    inStock: searchParams.get("inStock") || "false",
  }), [searchParams]);

  const updateFilters = useCallback((newFilters: Record<string, string | number | boolean>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
      else params.delete(key);
    });
    if (!newFilters.page) params.delete("page");
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (error) { console.error("Error fetching categories:", error); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?${searchParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch (error) { console.error("Error fetching products:", error); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => updateFilters({ page: newPage });

  const handleSortChange = (value: string) => updateFilters({ sortBy: value });

  return {
    products, categories, loading, view, setView, showMobileFilters, setShowMobileFilters,
    pagination, currentFilters, updateFilters, handlePageChange, handleSortChange, router,
  };
}
