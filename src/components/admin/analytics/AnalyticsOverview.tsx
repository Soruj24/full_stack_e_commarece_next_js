"use client";

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  BarChart3,
  UserCheck,
} from "lucide-react";
import type { AnalyticsStats } from "./useAnalyticsManager";

interface AnalyticsOverviewProps {
  stats: AnalyticsStats | null;
}

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  subtext,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  subtext?: string;
}) {
  return (
    <div className="border border-border/60 rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {subtext && (
        <p className="text-[11px] text-muted-foreground mt-1">{subtext}</p>
      )}
    </div>
  );
}

export function AnalyticsOverview({ stats }: AnalyticsOverviewProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      <KpiCard
        label="Revenue"
        value={`$${stats.periodRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        icon={DollarSign}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
      />
      <KpiCard
        label="Orders"
        value={String(stats.periodOrders)}
        icon={ShoppingBag}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
      />
      <KpiCard
        label="Customers"
        value={String(stats.periodNewUsers)}
        icon={Users}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-500"
        subtext={`${stats.totalUsers} total`}
      />
      <KpiCard
        label="Products"
        value={String(stats.totalProducts)}
        icon={Package}
        iconBg="bg-cyan-500/10"
        iconColor="text-cyan-500"
      />
      <KpiCard
        label="Conversion"
        value={`${stats.conversionRate.toFixed(1)}%`}
        icon={TrendingUp}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-600"
        subtext="visitor → order"
      />
      <KpiCard
        label="Avg Order"
        value={`$${stats.aov.toFixed(2)}`}
        icon={BarChart3}
        iconBg="bg-pink-500/10"
        iconColor="text-pink-500"
      />
      <KpiCard
        label="Retention"
        value={`${stats.retentionRate.toFixed(0)}%`}
        icon={UserCheck}
        iconBg="bg-teal-500/10"
        iconColor="text-teal-500"
        subtext="returning buyers"
      />
    </div>
  );
}
