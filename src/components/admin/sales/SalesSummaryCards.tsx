"use client";

import { DollarSign, ShoppingCart, TrendingUp, TrendingDown, Target } from "lucide-react";
import type { SalesSummary } from "@/modules/admin/types";

interface SalesSummaryCardsProps {
  data: SalesSummary | null;
}

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  growth,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  growth?: number;
}) {
  return (
    <div className="border border-border/60 rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {growth !== undefined && growth !== 0 && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-md ${
              growth >= 0
                ? "text-emerald-600 bg-emerald-500/10"
                : "text-red-600 bg-red-500/10"
            }`}
          >
            {growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

export function SalesSummaryCards({ data }: SalesSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        label="Total Sales"
        value={`$${(data?.totalSales || 0).toLocaleString()}`}
        icon={DollarSign}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        growth={data?.salesGrowth}
      />
      <KpiCard
        label="Total Orders"
        value={(data?.totalOrders || 0).toLocaleString()}
        icon={ShoppingCart}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
        growth={data?.ordersGrowth}
      />
      <KpiCard
        label="Avg Order Value"
        value={`$${(data?.avgOrderValue || 0).toLocaleString()}`}
        icon={Target}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-500"
        growth={data?.aovGrowth}
      />
      <KpiCard
        label="Conversion Rate"
        value={`${(data?.conversionRate || 0).toFixed(1)}%`}
        icon={TrendingUp}
        iconBg="bg-purple-500/10"
        iconColor="text-purple-500"
        growth={data?.conversionGrowth}
      />
    </div>
  );
}
