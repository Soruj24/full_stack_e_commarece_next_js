"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export type DatePreset = "7d" | "30d" | "90d" | "1y" | "custom";

export interface AnalyticsStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  activeUsers: number;
  periodRevenue: number;
  periodOrders: number;
  periodNewUsers: number;
  aov: number;
  conversionRate: number;
  retentionRate: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrdersPoint {
  date: string;
  orders: number;
}

export interface StatusPoint {
  name: string;
  value: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  image?: string;
  totalSold: number;
  revenue: number;
  price: number;
}

export interface TopCategory {
  _id: string;
  revenue: number;
  orders: number;
}

export function useAnalyticsManager() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [revenueChart, setRevenueChart] = useState<RevenuePoint[]>([]);
  const [ordersChart, setOrdersChart] = useState<OrdersPoint[]>([]);
  const [statusChart, setStatusChart] = useState<StatusPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [preset, setPreset] = useState<DatePreset>("30d");
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("preset", preset);
      if (preset === "custom" && customRange.start) params.set("startDate", customRange.start);
      if (preset === "custom" && customRange.end) params.set("endDate", customRange.end);

      const res = await fetch(`/api/admin/analytics?${params.toString()}`, {
        signal: abortRef.current.signal,
      });
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
        setRevenueChart(data.charts?.revenue || []);
        setOrdersChart(data.charts?.orders || []);
        setStatusChart(data.charts?.status || []);
        setTopProducts(data.topProducts || []);
        setTopCategories(data.topCategories || []);
      } else {
        toast.error("Failed to load analytics");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [preset, customRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handlePresetChange = useCallback((newPreset: DatePreset) => {
    setPreset(newPreset);
  }, []);

  const handleCustomRangeChange = useCallback(
    (start: string, end: string) => {
      setCustomRange({ start, end });
      setPreset("custom");
    },
    []
  );

  return {
    loading,
    stats,
    revenueChart,
    ordersChart,
    statusChart,
    topProducts,
    topCategories,
    preset,
    customRange,
    handlePresetChange,
    handleCustomRangeChange,
    refresh: fetchAnalytics,
  };
}
