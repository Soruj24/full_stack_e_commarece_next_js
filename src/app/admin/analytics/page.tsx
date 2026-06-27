"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AnalyticsHeader,
  AnalyticsSummaryCards,
  AnalyticsRevenueChart,
  AnalyticsStatusChart,
  AnalyticsTopProducts,
} from "@/components/admin/analytics";

interface AnalyticsData {
  summary: {
    revenue: number;
    orders: number;
    users: number;
    products: number;
  };
  charts: {
    revenue: { name: string; revenue: number }[];
    status: { name: string; value: number }[];
  };
  topProducts: {
    _id: string;
    name: string;
    salesCount: number;
    price: number;
  }[];
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        setData(json);
      } catch {
        toast.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <AnalyticsHeader />

      <AnalyticsSummaryCards data={data?.summary || null} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <AnalyticsRevenueChart data={data?.charts?.revenue || []} />
        <AnalyticsStatusChart data={data?.charts?.status || []} />
      </div>

      <AnalyticsTopProducts products={data?.topProducts || []} />
    </div>
  );
}