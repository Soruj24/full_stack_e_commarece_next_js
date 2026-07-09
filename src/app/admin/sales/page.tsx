"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  SalesHeader,
  SalesSummaryCards,
} from "@/components/admin/sales";

const SalesTrendChart = dynamic(() => import("@/components/admin/sales/SalesTrendChart").then(mod => ({ default: mod.SalesTrendChart })), {
  loading: () => <div className="h-[400px] bg-muted/20 animate-pulse rounded-xl" />,
  ssr: false,
});

const SalesByProduct = dynamic(() => import("@/components/admin/sales/SalesByProduct").then(mod => ({ default: mod.SalesByProduct })), {
  loading: () => <div className="h-[400px] bg-muted/20 animate-pulse rounded-xl" />,
  ssr: false,
});

const SalesByCategory = dynamic(() => import("@/components/admin/sales/SalesByCategory").then(mod => ({ default: mod.SalesByCategory })), {
  loading: () => <div className="h-[400px] bg-muted/20 animate-pulse rounded-xl" />,
  ssr: false,
});
import type { SalesSummary, SalesByDay, SalesByProduct as SalesByProductType, SalesByCategory as SalesByCategoryType } from "@/modules/admin/types";

interface SalesData {
  summary: SalesSummary;
  trend: SalesByDay[];
  topProducts: SalesByProductType[];
  categoryDistribution: SalesByCategoryType[];
}

export default function AdminSalesPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [data, setData] = useState<SalesData | null>(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sales?dateRange=${dateRange}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch sales data");
      setData(json);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch sales data");
      }
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <SalesHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRefresh={fetchSales}
        loading={loading}
      />

      <SalesSummaryCards data={data?.summary || null} />

      <SalesTrendChart data={data?.trend || []} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <SalesByCategory data={data?.categoryDistribution || []} />
        </div>
        <div className="lg:col-span-7">
          <SalesByProduct data={data?.topProducts || []} />
        </div>
      </div>
    </div>
  );
}
