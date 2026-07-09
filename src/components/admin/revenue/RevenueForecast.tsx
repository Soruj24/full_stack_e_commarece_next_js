"use client";

import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RevenueForecast as RevenueForecastType } from "@/modules/admin/types";

interface RevenueForecastProps {
  data: RevenueForecastType[];
}

export function RevenueForecast({ data }: RevenueForecastProps) {
  return (
    <div className="bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Revenue Forecast
        </h3>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
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
            <Area
              type="monotone"
              dataKey="upperBound"
              name="Upper Bound"
              stroke="none"
              fill="url(#confidenceBand)"
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              name="Lower Bound"
              stroke="none"
              fill="url(#confidenceBand)"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted Revenue"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
