"use client";

import { useAnalytics } from "@/modules/analytics/hooks/use-analytics";
import { AnalyticsStatsCards } from "./analytics/AnalyticsStatsCards";
import { SalesTrendChart } from "./analytics/SalesTrendChart";
import { CategoryInsightsChart } from "./analytics/CategoryInsightsChart";
import { TopProductsList } from "./analytics/TopProductsList";
import { UserEngagementChart } from "./analytics/UserEngagementChart";

export function AnalyticsTabContent() {
  const { data, loading } = useAnalytics();

  if (loading) {
    return <div className="h-96 bg-muted/20 animate-pulse rounded-[40px]" />;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <AnalyticsStatsCards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesTrendChart data={data?.salesData || []} />
        <CategoryInsightsChart data={data?.categoryStats || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopProductsList data={data?.topProducts || []} />
        <UserEngagementChart data={data?.userEngagement || []} />
      </div>
    </div>
  );
}
