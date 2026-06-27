"use client";

import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

interface RevenueData {
  name: string;
  revenue: number;
}

interface AnalyticsRevenueChartProps {
  data: RevenueData[];
}

export function AnalyticsRevenueChart({ data }: AnalyticsRevenueChartProps) {
  return (
    <div className="lg:col-span-8 bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Revenue Trends
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-bold"
          >
            7 Days
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs font-bold"
          >
            30 Days
          </Button>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 600 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ fontWeight: 700, fontSize: "12px" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={4}
              dot={{
                r: 6,
                fill: "#3b82f6",
                strokeWidth: 2,
                stroke: "#fff",
              }}
              activeDot={{
                r: 8,
                fill: "#3b82f6",
                strokeWidth: 2,
                stroke: "#fff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}