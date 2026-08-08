"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { IProduct } from "@/shared/types";

export type InventorySortField = "name" | "sku" | "stock" | "price" | "stockStatus" | "updatedAt";
export type SortDirection = "asc" | "desc";
export type StockFilter = "all" | "in_stock" | "low_stock" | "out_of_stock";

export interface InventoryFilters {
  search: string;
  stock: StockFilter;
  category: string;
}

export interface StockAdjustment {
  productId: string;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
}

export function useInventoryManager() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 0 });
  const [filters, setFilters] = useState<InventoryFilters>({
    search: "",
    stock: "all",
    category: "",
  });
  const [sort, setSort] = useState<{ field: InventorySortField; direction: SortDirection }>({
    field: "stock",
    direction: "asc",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<StockAdjustment[]>([]);
  const [adjustingProduct, setAdjustingProduct] = useState<IProduct | null>(null);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = useCallback(async (page = 1) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(pagination.limit));
      params.set("isArchived", "false");

      if (filters.search) params.set("keyword", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.stock === "in_stock") params.set("inStock", "true");

      params.set("sortBy", "stock");

      const res = await fetch(`/api/products?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();

      if (data.success) {
        let filteredProducts: IProduct[] = data.products || [];

        if (filters.stock === "low_stock") {
          filteredProducts = filteredProducts.filter(
            (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)
          );
        } else if (filters.stock === "out_of_stock") {
          filteredProducts = filteredProducts.filter((p) => p.stock === 0);
        }

        filteredProducts.sort((a, b) => {
          let aVal: number | string;
          let bVal: number | string;

          switch (sort.field) {
            case "name":
              aVal = a.name.toLowerCase();
              bVal = b.name.toLowerCase();
              break;
            case "sku":
              aVal = a.sku || "";
              bVal = b.sku || "";
              break;
            case "stock":
              aVal = a.stock;
              bVal = b.stock;
              break;
            case "price":
              aVal = a.discountPrice || a.price;
              bVal = b.discountPrice || b.price;
              break;
            case "stockStatus": {
              const order = { out_of_stock: 0, low_stock: 1, in_stock: 2 };
              aVal = order[a.stockStatus] ?? 2;
              bVal = order[b.stockStatus] ?? 2;
              break;
            }
            default:
              aVal = new Date(a.updatedAt).getTime();
              bVal = new Date(b.updatedAt).getTime();
          }

          if (sort.direction === "asc") return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        });

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
      setError("Failed to fetch inventory");
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.limit]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(1);
      setSelectedIds(new Set());
    }, 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [filters, sort, fetchProducts]);

  const handlePageChange = useCallback((page: number) => {
    fetchProducts(page);
    setSelectedIds(new Set());
  }, [fetchProducts]);

  const handleFilterChange = useCallback((key: keyof InventoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSortChange = useCallback((field: InventorySortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const adjustStock = useCallback(async (productId: string, newStock: number, reason: string) => {
    try {
      const product = products.find((p) => String(p._id) === productId);
      if (!product) return;

      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();

      if (data.success) {
        const adjustment: StockAdjustment = {
          productId,
          previousStock: product.stock,
          newStock,
          reason,
          timestamp: new Date().toISOString(),
        };
        setHistory((prev) => [adjustment, ...prev].slice(0, 100));

        setProducts((prev) =>
          prev.map((p) =>
            String(p._id) === productId ? { ...p, stock: newStock } : p
          )
        );

        toast.success(`Stock updated: ${product.name} → ${newStock}`);
      } else {
        toast.error(data.error || "Failed to update stock");
      }
    } catch {
      toast.error("Failed to update stock");
    }
  }, [products]);

  const handleBulkAdjust = useCallback(async (adjustment: number, reason: string) => {
    if (selectedIds.size === 0) return;

    const promises = Array.from(selectedIds).map((id) => {
      const product = products.find((p) => String(p._id) === id);
      if (!product) return Promise.resolve({ success: false });
      const newStock = Math.max(0, product.stock + adjustment);
      return fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      }).then((r) => r.json());
    });

    const results = await Promise.allSettled(promises);
    const succeeded = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;

    if (succeeded > 0) {
      toast.success(`Stock adjusted for ${succeeded} product(s)`);
      setSelectedIds(new Set());
      fetchProducts(pagination.page);
    }
  }, [selectedIds, products, pagination.page, fetchProducts]);

  const openAdjustDialog = useCallback((product: IProduct) => {
    setAdjustingProduct(product);
    setIsAdjustDialogOpen(true);
  }, []);

  const openHistory = useCallback(() => {
    setIsHistoryOpen(true);
  }, []);

  const stats = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.stock > 0 && p.stock > (p.lowStockThreshold || 10)).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    inventoryValue: products.reduce((sum, p) => sum + (p.discountPrice || p.price) * p.stock, 0),
    totalUnits: products.reduce((sum, p) => sum + p.stock, 0),
  };

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    sort,
    selectedIds,
    stats,
    history,
    adjustingProduct,
    isAdjustDialogOpen,
    isHistoryOpen,
    setIsAdjustDialogOpen,
    setIsHistoryOpen,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    adjustStock,
    handleBulkAdjust,
    openAdjustDialog,
    openHistory,
    refresh: () => fetchProducts(pagination.page),
  };
}
