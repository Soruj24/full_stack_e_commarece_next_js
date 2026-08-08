"use client";

import { Bell, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface NotificationStatsProps {
  stats: {
    total: number;
    sent: number;
    scheduled: number;
    failed: number;
  };
}

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="border border-border/60 rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export function NotificationStats({ stats }: NotificationStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard label="Total" value={stats.total} icon={Bell} iconBg="bg-blue-500/10" iconColor="text-blue-500" />
      <KpiCard label="Sent" value={stats.sent} icon={CheckCircle} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" />
      <KpiCard label="Scheduled" value={stats.scheduled} icon={Clock} iconBg="bg-amber-500/10" iconColor="text-amber-500" />
      <KpiCard label="Failed" value={stats.failed} icon={AlertCircle} iconBg="bg-red-500/10" iconColor="text-red-500" />
    </div>
  );
}
