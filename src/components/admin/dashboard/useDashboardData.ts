"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { User, IAuditLog } from "@/shared/types";
import type { AdminStats } from "@/modules/admin/services/admin-service";
import * as adminService from "@/modules/admin/services/admin-service";

interface SalesData {
  _id: string;
  revenue: number;
}

interface TopProduct {
  details: { name: string; images: string[] };
  totalSold: number;
  revenue: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  user?: { name: string; email: string };
}

interface LowStockItem {
  name: string;
  stock: number;
  category?: string;
}

interface DashboardData {
  stats: AdminStats | null;
  salesData: SalesData[];
  topProducts: TopProduct[];
  recentOrders: Order[];
  lowStockItems: LowStockItem[];
  users: User[];
  auditLogs: IAuditLog[];
  activityData: { date: string; count: number }[];
}

export function useDashboardData() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    stats: null,
    salesData: [],
    topProducts: [],
    recentOrders: [],
    lowStockItems: [],
    users: [],
    auditLogs: [],
    activityData: [],
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [analytics, users, auditLogs, activityData, ordersRes, lowStockRes] = await Promise.allSettled([
        adminService.fetchAnalytics(),
        adminService.fetchUsers(),
        adminService.fetchAuditLogs(),
        adminService.fetchActivityData(),
        fetch("/api/admin/orders?limit=5").then((r) => r.json()),
        fetch("/api/products/low-stock").then((r) => r.json()),
      ]);

      const analyticsData = analytics.status === "fulfilled" ? analytics.value : null;
      const usersData = users.status === "fulfilled" ? users.value : [];
      const auditData = auditLogs.status === "fulfilled" ? auditLogs.value : [];
      const activityResult = activityData.status === "fulfilled" ? activityData.value : [];
      const ordersData = ordersRes.status === "fulfilled" && ordersRes.value.success ? ordersRes.value.orders || [] : [];
      const lowStockData = lowStockRes.status === "fulfilled" && lowStockRes.value.success ? (lowStockRes.value.lowStock || []).slice(0, 5).map((p: { name: string; stock: number; category?: { name: string } }) => ({
        name: p.name,
        stock: p.stock,
        category: p.category?.name,
      })) : [];

      // Fetch detailed analytics for charts and top products
      let salesData: SalesData[] = [];
      let topProducts: TopProduct[] = [];
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        if (json.success) {
          salesData = json.salesData || [];
          topProducts = json.topProducts || [];
        }
      } catch {
        // Use empty arrays if analytics fails
      }

      setData({
        stats: analyticsData,
        salesData,
        topProducts,
        recentOrders: ordersData,
        lowStockItems: lowStockData,
        users: usersData,
        auditLogs: auditData,
        activityData: activityResult,
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === "admin" || session?.user?.role === "ADMIN") {
      fetchAll();
    }
  }, [session, fetchAll]);

  return { ...data, loading, refresh: fetchAll };
}
