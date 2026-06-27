"use client";

import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnalyticsData } from "@/features/analytics/types/analytics";

interface AnalyticsStatsCardsProps {
  data: AnalyticsData | null;
}

const STATS = [
  { label: "Total Revenue", key: "totalRevenue" as const, icon: DollarSign, trend: "+12.5%", up: true, alert: false, format: (v: number) => `$${v.toFixed(2)}` },
  { label: "Total Orders", key: "totalOrders" as const, icon: ShoppingBag, trend: "+8.2%", up: true, alert: false, format: (v: number) => v },
  { label: "Active Users", key: "activeUsers" as const, icon: Users, trend: "-2.4%", up: false, alert: false, format: (v: number) => v },
  { label: "Low Stock", key: "lowStockCount" as const, icon: Package, trend: "Attention", up: false, alert: true, format: (v: number) => v },
] as const;

export function AnalyticsStatsCards({ data }: AnalyticsStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATS.map((stat, i) => {
        const value = data?.stats?.[stat.key] || 0;
        return (
          <div
            key={i}
            className="p-8 rounded-[40px] bg-card border border-border/50 shadow-2xl shadow-primary/5 group hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "p-3 rounded-2xl transition-colors",
                  stat.alert
                    ? "bg-orange-500/10 text-orange-500"
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full",
                  stat.up ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive",
                )}
              >
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-4xl font-black tracking-tighter">{stat.format(value)}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
