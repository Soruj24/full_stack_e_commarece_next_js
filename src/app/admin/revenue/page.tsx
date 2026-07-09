"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  RevenueHeader,
  RevenueSummaryCards,
} from "@/components/admin/revenue";

const RevenueChart = dynamic(() => import("@/components/admin/revenue/RevenueChart").then(mod => ({ default: mod.RevenueChart })), {
  loading: () => <div className="h-[400px] bg-muted/20 animate-pulse rounded-xl" />,
  ssr: false,
});

const RevenuePaymentMethods = dynamic(() => import("@/components/admin/revenue/RevenuePaymentMethods").then(mod => ({ default: mod.RevenuePaymentMethods })), {
  loading: () => <div className="h-[400px] bg-muted/20 animate-pulse rounded-xl" />,
  ssr: false,
});

const RevenueForecast = dynamic(() => import("@/components/admin/revenue/RevenueForecast").then(mod => ({ default: mod.RevenueForecast })), {
  loading: () => <div className="h-[400px] bg-muted/20 animate-pulse rounded-xl" />,
  ssr: false,
});
import type { RevenueSummary, RevenueByPeriod, RevenueByPaymentMethod, RevenueForecast as RevenueForecastType } from "@/modules/admin/types";

interface RevenueData {
  summary: RevenueSummary;
  byPeriod: RevenueByPeriod[];
  paymentMethods: RevenueByPaymentMethod[];
  forecast: RevenueForecastType[];
}

export default function AdminRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RevenueData | null>(null);

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/revenue");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch revenue data");
      setData(json);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch revenue data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <RevenueHeader onRefresh={fetchRevenue} loading={loading} />

      <RevenueSummaryCards data={data?.summary || null} />

      <RevenueChart data={data?.byPeriod || []} />

      <RevenuePaymentMethods data={data?.paymentMethods || []} />

      <RevenueForecast data={data?.forecast || []} />
    </div>
  );
}
