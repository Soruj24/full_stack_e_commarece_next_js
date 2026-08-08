"use client";

import { StatCard } from "@/components/admin/ui/StatCard";
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, AlertTriangle } from "lucide-react";

interface KpiCardsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    activeUsers: number;
    lowStockCount: number;
  };
}

export function KpiCards({ stats }: KpiCardsProps) {
  const avgOrder = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      <StatCard
        label="Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        iconColor="text-emerald-500"
      />
      <StatCard
        label="Orders"
        value={stats.totalOrders.toLocaleString()}
        icon={ShoppingBag}
        iconColor="text-blue-500"
      />
      <StatCard
        label="Products"
        value={stats.totalProducts.toLocaleString()}
        icon={Package}
        iconColor="text-indigo-500"
      />
      <StatCard
        label="Active Users"
        value={stats.activeUsers.toLocaleString()}
        icon={Users}
        iconColor="text-orange-500"
      />
      <StatCard
        label="Low Stock"
        value={stats.lowStockCount.toLocaleString()}
        icon={AlertTriangle}
        iconColor={stats.lowStockCount > 0 ? "text-red-500" : "text-emerald-500"}
      />
      <StatCard
        label="Avg Order"
        value={`$${avgOrder.toFixed(2)}`}
        icon={TrendingUp}
        iconColor="text-purple-500"
      />
    </div>
  );
}
