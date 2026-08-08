"use client";

import { DollarSign, TrendingUp, TrendingDown, Wallet, Ban } from "lucide-react";
import type { RevenueSummary } from "@/modules/admin/types";

interface RevenueSummaryCardsProps {
  data: RevenueSummary | null;
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

export function RevenueSummaryCards({ data }: RevenueSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        label="Total Revenue"
        value={`$${(data?.totalRevenue || 0).toLocaleString()}`}
        icon={DollarSign}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        growth={data?.revenueGrowth}
      />
      <KpiCard
        label="Net Revenue"
        value={`$${(data?.netRevenue || 0).toLocaleString()}`}
        icon={Wallet}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
        growth={data?.revenueGrowth}
      />
      <KpiCard
        label="Refunded Amount"
        value={`$${(data?.refundedAmount || 0).toLocaleString()}`}
        icon={Ban}
        iconBg="bg-red-500/10"
        iconColor="text-red-500"
        growth={data?.refundRate ? -data.refundRate : undefined}
      />
      <KpiCard
        label="Pending Payouts"
        value={`$${(data?.pendingPayouts || 0).toLocaleString()}`}
        icon={Wallet}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-500"
      />
    </div>
  );
}
