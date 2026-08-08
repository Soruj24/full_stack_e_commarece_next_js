"use client";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  useAnalyticsManager,
  DateRangeSelector,
  AnalyticsOverview,
  AnalyticsRevenueChart,
  AnalyticsOrdersChart,
  AnalyticsTopProducts,
  AnalyticsTopCategories,
  AnalyticsOrderStatus,
  AnalyticsConversionFunnel,
} from "@/components/admin/analytics";

export default function AnalyticsPage() {
  const {
    loading,
    stats,
    revenueChart,
    ordersChart,
    statusChart,
    topProducts,
    topCategories,
    preset,
    customRange,
    handlePresetChange,
    handleCustomRangeChange,
  } = useAnalyticsManager();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Analytics"
          description="Performance metrics and business insights"
        />
        <DateRangeSelector
          preset={preset}
          customRange={customRange}
          onPresetChange={handlePresetChange}
          onCustomRangeChange={handleCustomRangeChange}
        />
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[300px] bg-muted/30 rounded-xl animate-pulse" />
            <div className="h-[300px] bg-muted/30 rounded-xl animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          <AnalyticsOverview stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsRevenueChart data={revenueChart} />
            <AnalyticsOrdersChart data={ordersChart} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AnalyticsOrderStatus data={statusChart} />
            <AnalyticsConversionFunnel
              totalUsers={stats?.totalUsers || 0}
              newUsers={stats?.periodNewUsers || 0}
              periodOrders={stats?.periodOrders || 0}
            />
            <div className="border border-border/60 rounded-xl p-6 bg-card">
              <p className="text-sm font-medium mb-1">Summary</p>
              <p className="text-xs text-muted-foreground mb-5">Key metrics at a glance</p>
              <div className="space-y-4">
                <SummaryRow label="Active Users" value={String(stats?.activeUsers || 0)} />
                <SummaryRow label="Avg Order Value" value={`$${stats?.aov.toFixed(2) || "0.00"}`} />
                <SummaryRow label="Conversion Rate" value={`${stats?.conversionRate.toFixed(1) || "0"}%`} />
                <SummaryRow label="Retention Rate" value={`${stats?.retentionRate.toFixed(0) || "0"}%`} />
                <SummaryRow label="Total Revenue" value={`$${stats?.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}`} />
                <SummaryRow label="Total Orders" value={String(stats?.totalOrders || 0)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsTopProducts products={topProducts} />
            <AnalyticsTopCategories categories={topCategories} />
          </div>
        </>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}
