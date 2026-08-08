"use client";

interface ConversionFunnelProps {
  totalUsers: number;
  newUsers: number;
  periodOrders: number;
}

export function AnalyticsConversionFunnel({ totalUsers, newUsers, periodOrders }: ConversionFunnelProps) {
  const steps = [
    { label: "Total Users", value: totalUsers, pct: 100 },
    {
      label: "New This Period",
      value: newUsers,
      pct: totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0,
    },
    {
      label: "Orders Placed",
      value: periodOrders,
      pct: totalUsers > 0 ? (periodOrders / totalUsers) * 100 : 0,
    },
  ];

  const maxVal = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className="border border-border/60 rounded-xl p-6 bg-card">
      <p className="text-sm font-medium mb-1">Conversion Funnel</p>
      <p className="text-xs text-muted-foreground mb-5">User journey from visit to purchase</p>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={step.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">{step.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium tabular-nums">{step.value.toLocaleString()}</span>
                <span className="text-[11px] text-muted-foreground tabular-nums w-12 text-right">
                  {step.pct.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground/15 transition-all"
                style={{ width: `${(step.value / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
