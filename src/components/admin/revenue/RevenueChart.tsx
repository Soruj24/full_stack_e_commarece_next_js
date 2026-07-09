"use client";

import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RevenueByPeriod } from "@/modules/admin/types";

interface RevenueChartProps {
  data: RevenueByPeriod[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Revenue Overview
        </h3>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="revenueBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="netRevenueBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="period"
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
            <Legend
              wrapperStyle={{ fontSize: "12px", fontWeight: 700 }}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="url(#revenueBar)"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
            <Line
              type="monotone"
              dataKey="netRevenue"
              name="Net Revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
