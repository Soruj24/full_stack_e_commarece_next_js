"use client";

import type { StatusPoint } from "./useAnalyticsManager";

interface OrderStatusChartProps {
  data: StatusPoint[];
}

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  delivered: { color: "text-emerald-500", bg: "bg-emerald-500" },
  processing: { color: "text-blue-500", bg: "bg-blue-500" },
  shipped: { color: "text-violet-500", bg: "bg-violet-500" },
  cancelled: { color: "text-red-500", bg: "bg-red-500" },
  returned: { color: "text-amber-500", bg: "bg-amber-500" },
  pending: { color: "text-muted-foreground", bg: "bg-muted-foreground" },
};

export function AnalyticsOrderStatus({ data }: OrderStatusChartProps) {
  if (data.length === 0) {
    return (
      <div className="border border-border/60 rounded-xl p-6 bg-card">
        <p className="text-sm font-medium mb-1">Order Status</p>
        <p className="text-xs text-muted-foreground">No order data for this period</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="border border-border/60 rounded-xl p-6 bg-card">
      <p className="text-sm font-medium mb-1">Order Status</p>
      <p className="text-xs text-muted-foreground mb-5">{total} total orders</p>

      <div className="h-2 rounded-full bg-muted/50 overflow-hidden flex mb-5">
        {data.map((item, i) => {
          const style = STATUS_STYLES[item.name] || STATUS_STYLES.pending;
          return (
            <div
              key={item.name}
              className={`${style.bg} h-full first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${(item.value / total) * 100}%` }}
              title={`${item.name}: ${item.value}`}
            />
          );
        })}
      </div>

      <div className="space-y-2.5">
        {data.map((item) => {
          const style = STATUS_STYLES[item.name] || STATUS_STYLES.pending;
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${style.bg}`} />
                <span className="text-sm capitalize">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
                <span className="text-sm font-medium tabular-nums w-8 text-right">{item.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
