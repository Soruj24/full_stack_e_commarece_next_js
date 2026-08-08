"use client";

import { ShoppingBag } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OrdersChartProps {
  data: Array<{ date: string; orders: number }>;
}

export function OrdersChart({ data }: OrdersChartProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Orders</h3>
        </div>
      </div>
      <div className="p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                color: "var(--foreground)",
              }}
              cursor={{ fill: "var(--primary)", opacity: 0.1 }}
            />
            <Bar
              dataKey="orders"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
