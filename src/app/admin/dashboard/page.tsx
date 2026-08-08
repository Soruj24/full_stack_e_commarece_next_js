"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { AdminTabsList } from "@/components/admin/dashboard/AdminTabsList";
import { KpiCards } from "@/components/admin/dashboard/KpiCards";
import { DateRangeSelector } from "@/components/admin/dashboard/DateRangeSelector";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { OrdersChart } from "@/components/admin/dashboard/OrdersChart";
import { RecentOrdersTable } from "@/components/admin/dashboard/RecentOrdersTable";
import { TopProductsCard } from "@/components/admin/dashboard/TopProductsCard";
import { LowStockAlert } from "@/components/admin/dashboard/LowStockAlert";
import { RecentCustomers } from "@/components/admin/dashboard/RecentCustomers";
import { ActivityFeed } from "@/components/admin/dashboard/ActivityFeed";
import { SystemHealth } from "@/components/admin/dashboard/SystemHealth";
import { DashboardErrorBoundary } from "@/components/admin/dashboard/DashboardErrorBoundary";
import { useDashboardData } from "@/components/admin/dashboard/useDashboardData";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[350px] bg-muted/30 rounded-xl animate-pulse" />
        <div className="h-[350px] bg-muted/30 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-muted/30 rounded-xl animate-pulse" />
        <div className="h-[400px] bg-muted/30 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "overview";
  const [dateRange, setDateRange] = useState("30d");

  const {
    loading,
    stats,
    salesData,
    topProducts,
    recentOrders,
    lowStockItems,
    users,
    auditLogs,
    activityData,
    refresh,
  } = useDashboardData();

  const setTab = (tab: string) => {
    router.push(`/admin/dashboard?tab=${tab}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Analytics, orders, and business insights."
        />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Dashboard"
          description="Analytics, orders, and business insights."
          className="mb-0"
        />
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {stats && <KpiCards stats={stats} />}

      <Tabs
        value={activeTab}
        onValueChange={setTab}
        className="w-full space-y-6"
      >
        <AdminTabsList activeTab={activeTab} />

        <TabsContent value="overview" className="space-y-6">
          <DashboardErrorBoundary fallbackTitle="Failed to load charts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart data={salesData.map((d) => ({ date: d._id, revenue: d.revenue }))} />
              <OrdersChart data={salesData.map((d) => ({ date: d._id, orders: Math.round(d.revenue / 100) }))} />
            </div>
          </DashboardErrorBoundary>

          <SystemHealth />

          <DashboardErrorBoundary fallbackTitle="Failed to load orders">
            <RecentOrdersTable orders={recentOrders} />
          </DashboardErrorBoundary>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DashboardErrorBoundary fallbackTitle="Failed to load products">
              <TopProductsCard products={topProducts} />
            </DashboardErrorBoundary>
            <DashboardErrorBoundary fallbackTitle="Failed to load stock alerts">
              <LowStockAlert items={lowStockItems} />
            </DashboardErrorBoundary>
            <DashboardErrorBoundary fallbackTitle="Failed to load customers">
              <RecentCustomers customers={users} />
            </DashboardErrorBoundary>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardErrorBoundary fallbackTitle="Failed to load activity">
              <ActivityFeed logs={auditLogs} />
            </DashboardErrorBoundary>
            <DashboardErrorBoundary fallbackTitle="Failed to load user activity">
              <div className="rounded-xl border border-border/60 bg-card p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">User Activity</h3>
                <div className="space-y-2">
                  {activityData.slice(-7).map((day, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{day.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min((day.count / Math.max(...activityData.map((d) => d.count), 1)) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground w-8 text-right">{day.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Analytics dashboard coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Orders management coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">User management coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Settings coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
