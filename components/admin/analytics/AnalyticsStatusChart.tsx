"use client";

import { Activity } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatusData {
  name: string;
  value: number;
}

interface AnalyticsStatusChartProps {
  data: StatusData[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AnalyticsStatusChart({ data }: AnalyticsStatusChartProps) {
  return (
    <div className="lg:col-span-4 bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
      <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Order Status
      </h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_entry, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3 mt-4">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-sm font-bold capitalize">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-black">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}