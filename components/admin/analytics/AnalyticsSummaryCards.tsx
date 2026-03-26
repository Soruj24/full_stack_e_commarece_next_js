"use client";

import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight } from "lucide-react";

interface SummaryData {
  revenue: number;
  orders: number;
  users: number;
  products: number;
}

interface AnalyticsSummaryCardsProps {
  data: SummaryData | null;
}

export function AnalyticsSummaryCards({ data }: AnalyticsSummaryCardsProps) {
  const stats = [
    {
      label: "Total Revenue",
      value: `$${(data?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      trend: "+12.5%",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Orders",
      value: data?.orders || 0,
      icon: ShoppingBag,
      trend: "+8.2%",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Users",
      value: data?.users || 0,
      icon: Users,
      trend: "+5.4%",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Products",
      value: data?.products || 0,
      icon: Package,
      trend: "+2.1%",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-card p-6 rounded-[32px] border border-border/50 shadow-xl shadow-primary/5 group hover:border-primary/30 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {stat.trend}
            </span>
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
            {stat.label}
          </p>
          <h3 className="text-3xl font-black tracking-tighter">
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}