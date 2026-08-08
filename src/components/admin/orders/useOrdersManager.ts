"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { IOrder } from "@/core/database/models/Order";

export type OrderSortField = "createdAt" | "totalAmount" | "orderStatus" | "paymentStatus";
export type OrderSortDirection = "asc" | "desc";

export interface OrderFilters {
  search: string;
  orderStatus: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
}

export function useOrdersManager() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    orderStatus: "all",
    paymentStatus: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [sort, setSort] = useState<{ field: OrderSortField; direction: OrderSortDirection }>({
    field: "createdAt",
    direction: "desc",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrders = useCallback(async (page = 1) => {
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
      if (filters.orderStatus !== "all") params.set("status", filters.orderStatus);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();

      if (data.success) {
        let filteredOrders = data.orders || [];

        if (filters.paymentStatus !== "all") {
          filteredOrders = filteredOrders.filter(
            (o: IOrder) => o.paymentStatus === filters.paymentStatus
          );
        }

        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom);
          filteredOrders = filteredOrders.filter(
            (o: IOrder) => new Date(o.createdAt) >= from
          );
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo);
          to.setHours(23, 59, 59, 999);
          filteredOrders = filteredOrders.filter(
            (o: IOrder) => new Date(o.createdAt) <= to
          );
        }

        filteredOrders.sort((a: IOrder, b: IOrder) => {
          let aVal: number | string;
          let bVal: number | string;

          switch (sort.field) {
            case "totalAmount":
              aVal = a.totalAmount;
              bVal = b.totalAmount;
              break;
            case "orderStatus":
              aVal = a.orderStatus;
              bVal = b.orderStatus;
              break;
            case "paymentStatus":
              aVal = a.paymentStatus;
              bVal = b.paymentStatus;
              break;
            default:
              aVal = new Date(a.createdAt).getTime();
              bVal = new Date(b.createdAt).getTime();
          }

          if (sort.direction === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          }
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        });

        setOrders(filteredOrders);
        setPagination((prev) => ({
          ...prev,
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      } else {
        setError(data.error || "Failed to fetch orders");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Failed to fetch orders");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.limit]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchOrders(1);
      setSelectedIds(new Set());
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters, sort, fetchOrders]);

  const handlePageChange = useCallback((page: number) => {
    fetchOrders(page);
    setSelectedIds(new Set());
  }, [fetchOrders]);

  const handleFilterChange = useCallback((key: keyof OrderFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSortChange = useCallback((field: OrderSortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => String(o._id))));
    }
  }, [selectedIds.size, orders]);

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

  const handleUpdateStatus = useCallback(async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });
      if (res.ok) {
        toast.success("Order status updated");
        fetchOrders(pagination.page);
        setSelectedOrder(null);
        setIsDrawerOpen(false);
      } else {
        toast.error("Failed to update order status");
      }
    } catch {
      toast.error("Failed to update order status");
    }
  }, [pagination.page, fetchOrders]);

  const handleBulkStatusChange = useCallback(async (status: string) => {
    if (selectedIds.size === 0) return;

    try {
      const promises = Array.from(selectedIds).map((id) =>
        fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: id, orderStatus: status }),
        }).then((r) => r.json())
      );
      const results = await Promise.allSettled(promises);
      const succeeded = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;

      toast.success(`${succeeded} order(s) updated`);
      setSelectedIds(new Set());
      fetchOrders(pagination.page);
    } catch {
      toast.error("Failed to update orders");
    }
  }, [selectedIds, pagination.page, fetchOrders]);

  const handleExport = useCallback(() => {
    const headers = ["Order ID", "Customer", "Email", "Items", "Total", "Status", "Payment", "Date"];
    const rows = orders.map((o) => [
      o._id,
      (o as unknown as { user?: { name?: string } }).user?.name || "Guest",
      (o as unknown as { user?: { email?: string } }).user?.email || "N/A",
      String(o.items.length),
      `$${o.totalAmount.toFixed(2)}`,
      o.orderStatus,
      o.paymentStatus,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Orders exported");
  }, [orders]);

  const viewOrder = useCallback((order: IOrder) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedOrder(null);
  }, []);

  const stats = {
    total: pagination.total,
    processing: orders.filter((o) => o.orderStatus === "processing").length,
    shipped: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return {
    orders,
    loading,
    error,
    pagination,
    filters,
    sort,
    selectedIds,
    selectedOrder,
    isDrawerOpen,
    stats,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    handleUpdateStatus,
    handleBulkStatusChange,
    handleExport,
    viewOrder,
    closeDrawer,
    refresh: () => fetchOrders(pagination.page),
  };
}
