"use client";

import { TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AnalyticsData } from "@/modules/analytics/types/analytics";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

interface CategoryInsightsChartProps {
  data: AnalyticsData["categoryStats"];
}

export function CategoryInsightsChart({ data }: CategoryInsightsChartProps) {
  return (
    <div className="p-10 rounded-[48px] bg-card border border-border/50 shadow-2xl shadow-primary/5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black tracking-tighter">
            Category <span className="text-primary">Insights</span>
          </h3>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Revenue distribution by category
          </p>
        </div>
        <div className="p-3 bg-muted/50 rounded-2xl">
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data || []}
              cx="50%" cy="50%"
              innerRadius={80} outerRadius={120}
              paddingAngle={8}
              dataKey="revenue"
            >
              {(data || []).map((_: unknown, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)", padding: "16px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
