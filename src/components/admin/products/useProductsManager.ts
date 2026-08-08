"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { IProduct, ICategory } from "@/shared/types";

export type SortField = "name" | "price" | "stock" | "rating" | "createdAt" | "numReviews";
export type SortDirection = "asc" | "desc";

export interface ProductFilters {
  search: string;
  category: string;
  status: "all" | "active" | "archived" | "featured";
  stock: "all" | "in_stock" | "low_stock" | "out_of_stock";
  priceMin: string;
  priceMax: string;
}

export interface ProductsManagerState {
  products: IProduct[];
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; pages: number };
  filters: ProductFilters;
  sort: { field: SortField; direction: SortDirection };
  selectedIds: Set<string>;
  categories: ICategory[];
}

export function useProductsManager() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "",
    status: "all",
    stock: "all",
    priceMin: "",
    priceMax: "",
  });
  const [sort, setSort] = useState<{ field: SortField; direction: SortDirection }>({
    field: "createdAt",
    direction: "desc",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = useCallback(async (page = 1) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(pagination.limit));

      if (filters.search) params.set("keyword", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.status === "active") params.set("isActive", "true");
      if (filters.status === "archived") params.set("isArchived", "true");
      if (filters.status === "featured") params.set("featured", "true");
      if (filters.stock === "in_stock") params.set("inStock", "true");
      if (filters.priceMin) params.set("minPrice", filters.priceMin);
      if (filters.priceMax) params.set("maxPrice", filters.priceMax);

      const sortMap: Record<string, string> = {
        name: sort.direction === "asc" ? "name_asc" : "name_desc",
        price: sort.direction === "asc" ? "price_asc" : "price_desc",
        stock: "stock",
        rating: "rating",
        createdAt: sort.direction === "asc" ? "oldest" : "newest",
        numReviews: "popular",
      };
      params.set("sortBy", sortMap[sort.field] || "-createdAt");

      const res = await fetch(`/api/products?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();

      if (data.success) {
        let filteredProducts = data.products || [];

        if (filters.stock === "low_stock") {
          filteredProducts = filteredProducts.filter(
            (p: IProduct) => p.stock > 0 && p.stock <= 10
          );
        } else if (filters.stock === "out_of_stock") {
          filteredProducts = filteredProducts.filter((p: IProduct) => p.stock === 0);
        }

        setProducts(filteredProducts);
        setPagination((prev) => ({
          ...prev,
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      } else {
        setError(data.error || "Failed to fetch products");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Failed to fetch products");
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.limit]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
    } catch {
      console.error("Failed to fetch categories");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(1);
      setSelectedIds(new Set());
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters, sort, fetchProducts]);

  const handlePageChange = useCallback((page: number) => {
    fetchProducts(page);
    setSelectedIds(new Set());
  }, [fetchProducts]);

  const handleFilterChange = useCallback((key: keyof ProductFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSortChange = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => String(p._id))));
    }
  }, [selectedIds.size, products]);

  const toggleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} product(s)?`)) return;

    try {
      const promises = Array.from(selectedIds).map((id) =>
        fetch(`/api/products/${id}`, { method: "DELETE" }).then((r) => r.json())
      );
      const results = await Promise.allSettled(promises);
      const succeeded = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;
      const failed = results.length - succeeded;

      if (succeeded > 0) {
        toast.success(`${succeeded} product(s) deleted`);
      }
      if (failed > 0) {
        toast.error(`${failed} product(s) failed to delete`);
      }

      setSelectedIds(new Set());
      fetchProducts(pagination.page);
    } catch {
      toast.error("Failed to delete products");
    }
  }, [selectedIds, pagination.page, fetchProducts]);

  const handleBulkStatusChange = useCallback(
    async (isActive: boolean) => {
      if (selectedIds.size === 0) return;

      try {
        const promises = Array.from(selectedIds).map((id) =>
          fetch(`/api/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive }),
          }).then((r) => r.json())
        );
        const results = await Promise.allSettled(promises);
        const succeeded = results.filter(
          (r) => r.status === "fulfilled" && r.value.success
        ).length;

        toast.success(`${succeeded} product(s) updated`);
        setSelectedIds(new Set());
        fetchProducts(pagination.page);
      } catch {
        toast.error("Failed to update products");
      }
    },
    [selectedIds, pagination.page, fetchProducts]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this product?")) return;

      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          toast.success("Product deleted");
          fetchProducts(pagination.page);
        } else {
          toast.error(data.error || "Failed to delete product");
        }
      } catch {
        toast.error("Failed to delete product");
      }
    },
    [pagination.page, fetchProducts]
  );

  const handleAddProduct = useCallback(() => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditProduct = useCallback((product: IProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  }, []);

  const mapToDialogProduct = useCallback((p: IProduct | null) => {
    if (!p) return null;
    return {
      _id: String(p._id),
      name: p.name,
      description: p.description,
      price: p.price,
      category:
        typeof p.category === "object" && p.category !== null
          ? {
              _id: String((p.category as unknown as ICategory)._id),
              name: (p.category as unknown as ICategory).name || "Uncategorized",
              slug: (p.category as unknown as ICategory).slug || "",
            }
          : { _id: "", name: "Uncategorized", slug: "" },
      stock: p.stock,
      brand: p.brand,
      sku: p.sku,
      images: p.images,
    };
  }, []);

  const refresh = useCallback(() => {
    fetchProducts(pagination.page);
  }, [fetchProducts, pagination.page]);

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    sort,
    selectedIds,
    categories,
    selectedProduct,
    isDialogOpen,
    setIsDialogOpen,
    setSelectedProduct,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    handleBulkDelete,
    handleBulkStatusChange,
    handleDelete,
    handleAddProduct,
    handleEditProduct,
    mapToDialogProduct,
    refresh,
    lowStockProducts: products.filter((p) => p.stock > 0 && p.stock <= 10),
    outOfStockProducts: products.filter((p) => p.stock === 0),
  };
}
