"use client";

import { StatCard } from "@/components/admin/ui/StatCard";
import { Package, AlertTriangle } from "lucide-react";

interface InventoryStatsProps {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export function InventoryStats({ totalProducts, lowStockCount, outOfStockCount }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard label="Total Products" value={totalProducts} icon={Package} iconColor="text-blue-500" />
      <StatCard label="Low Stock" value={lowStockCount} icon={AlertTriangle} iconColor="text-amber-500" />
      <StatCard label="Out of Stock" value={outOfStockCount} icon={AlertTriangle} iconColor="text-red-500" />
    </div>
  );
}
