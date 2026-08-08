"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { OrdersPoint } from "./useAnalyticsManager";

interface OrdersChartProps {
  data: OrdersPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/60 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold">{payload[0].value} orders</p>
    </div>
  );
}

export function AnalyticsOrdersChart({ data }: OrdersChartProps) {
  if (data.length === 0) {
    return (
      <div className="border border-border/60 rounded-xl p-6 bg-card">
        <p className="text-sm font-medium mb-1">Orders</p>
        <p className="text-xs text-muted-foreground mb-6">No order data for this period</p>
        <div className="h-[250px] flex items-center justify-center text-xs text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border/60 rounded-xl p-6 bg-card">
      <p className="text-sm font-medium mb-1">Orders</p>
      <p className="text-xs text-muted-foreground mb-6">
        {data.reduce((s, d) => s + d.orders, 0)} total orders
      </p>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
