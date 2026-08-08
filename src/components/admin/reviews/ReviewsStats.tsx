"use client";

import { Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

interface ReviewsStatsProps {
  stats: {
    total: number;
    avgRating: string;
    fiveStar: number;
    oneStar: number;
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
  value: string;
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

export function ReviewsStats({ stats }: ReviewsStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard label="Total Reviews" value={String(stats.total)} icon={MessageSquare} iconBg="bg-blue-500/10" iconColor="text-blue-500" />
      <KpiCard label="Average Rating" value={stats.avgRating} icon={Star} iconBg="bg-amber-500/10" iconColor="text-amber-500" />
      <KpiCard label="5-Star Reviews" value={String(stats.fiveStar)} icon={ThumbsUp} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" />
      <KpiCard label="1-Star Reviews" value={String(stats.oneStar)} icon={ThumbsDown} iconBg="bg-red-500/10" iconColor="text-red-500" />
    </div>
  );
}
