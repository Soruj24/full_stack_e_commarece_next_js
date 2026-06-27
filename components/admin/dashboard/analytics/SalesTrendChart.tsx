"use client";

import { Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AnalyticsData } from "@/features/analytics/types/analytics";

interface SalesTrendChartProps {
  data: AnalyticsData["salesData"];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <div className="p-10 rounded-[48px] bg-card border border-border/50 shadow-2xl shadow-primary/5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black tracking-tighter">
            Sales <span className="text-primary">Trend</span>
          </h3>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Daily revenue for the last 30 days
          </p>
        </div>
        <div className="p-3 bg-muted/50 rounded-2xl">
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data || []}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} />
            <Tooltip contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)", padding: "16px" }} />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
