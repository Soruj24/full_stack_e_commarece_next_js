"use client";

import { DollarSign, ShoppingCart, TrendingUp, TrendingDown, Target } from "lucide-react";
import type { SalesSummary } from "@/modules/admin/types";

interface SalesSummaryCardsProps {
  data: SalesSummary | null;
}

export function SalesSummaryCards({ data }: SalesSummaryCardsProps) {
  const cards = [
    {
      label: "Total Sales",
      value: `$${(data?.totalSales || 0).toLocaleString()}`,
      icon: DollarSign,
      growth: data?.salesGrowth || 0,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Total Orders",
      value: (data?.totalOrders || 0).toLocaleString(),
      icon: ShoppingCart,
      growth: data?.ordersGrowth || 0,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Avg Order Value",
      value: `$${(data?.avgOrderValue || 0).toLocaleString()}`,
      icon: Target,
      growth: data?.aovGrowth || 0,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      label: "Conversion Rate",
      value: `${(data?.conversionRate || 0).toFixed(1)}%`,
      icon: TrendingUp,
      growth: data?.conversionGrowth || 0,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-card p-6 rounded-[32px] border border-border/50 shadow-xl shadow-primary/5 group hover:border-primary/30 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}
            >
              <card.icon className="w-6 h-6" />
            </div>
            <span
              className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${
                card.growth >= 0
                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
                  : "text-red-600 bg-red-50 dark:bg-red-500/10"
              }`}
            >
              {card.growth >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {card.growth >= 0 ? "+" : ""}
              {card.growth.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
            {card.label}
          </p>
          <h3 className="text-3xl font-black tracking-tighter">
            {card.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
