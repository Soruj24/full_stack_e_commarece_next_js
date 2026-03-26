"use client";

import { Package, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InventoryStatsProps {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export function InventoryStats({ totalProducts, lowStockCount, outOfStockCount }: InventoryStatsProps) {
  const stats = [
    {
      label: "Total SKU Items",
      value: totalProducts,
      icon: Package,
      color: "primary",
      badge: "+12%",
      badgeColor: "green-500",
    },
    {
      label: "Low Stock Alerts",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "orange-500",
      badge: "Attention",
      badgeColor: "orange-500",
    },
    {
      label: "Out of Stock",
      value: outOfStockCount,
      icon: AlertTriangle,
      color: "destructive",
      badge: "Critical",
      badgeColor: "destructive",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="p-8 rounded-[40px] bg-card border border-border/50 shadow-2xl shadow-primary/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-2xl bg-${stat.color}/10 text-${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <Badge className={`bg-${stat.badgeColor}/10 text-${stat.badgeColor} border-none px-3`}>
              {stat.badge}
            </Badge>
          </div>
          <div>
            <p className={`text-4xl font-black tracking-tighter ${i === 1 ? "text-orange-500" : i === 2 ? "text-destructive" : ""}`}>
              {stat.value}
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}