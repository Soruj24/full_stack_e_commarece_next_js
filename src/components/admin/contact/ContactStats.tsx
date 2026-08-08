"use client";

import { MessageSquare, Clock, Eye, CheckCircle } from "lucide-react";

interface ContactStatsProps {
  stats: {
    total: number;
    pending: number;
    read: number;
    replied: number;
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

export function ContactStats({ stats }: ContactStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard label="Total Messages" value={stats.total} icon={MessageSquare} iconBg="bg-blue-500/10" iconColor="text-blue-500" />
      <KpiCard label="Pending" value={stats.pending} icon={Clock} iconBg="bg-amber-500/10" iconColor="text-amber-500" />
      <KpiCard label="Read" value={stats.read} icon={Eye} iconBg="bg-purple-500/10" iconColor="text-purple-500" />
      <KpiCard label="Replied" value={stats.replied} icon={CheckCircle} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" />
    </div>
  );
}
