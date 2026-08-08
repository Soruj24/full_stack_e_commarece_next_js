"use client";

import { StatCard } from "@/components/admin/ui/StatCard";
import { ShoppingBag, Clock, Truck, CheckCircle, DollarSign } from "lucide-react";

interface OrdersStatsProps {
  stats: {
    total: number;
    processing: number;
    shipped: number;
    delivered: number;
    totalRevenue: number;
  };
}

export function OrdersStats({ stats }: OrdersStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <StatCard label="Total Orders" value={stats.total} icon={ShoppingBag} iconColor="text-blue-500" />
      <StatCard label="Processing" value={stats.processing} icon={Clock} iconColor="text-amber-500" />
      <StatCard label="Shipped" value={stats.shipped} icon={Truck} iconColor="text-purple-500" />
      <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle} iconColor="text-emerald-500" />
      <StatCard label="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} iconColor="text-emerald-500" />
    </div>
  );
}
