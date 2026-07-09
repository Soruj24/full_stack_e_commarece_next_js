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

export function NotificationStats({ stats }: NotificationStatsProps) {
  const items = [
    {
      title: "Total",
      value: stats.total,
      icon: Bell,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Sent",
      value: stats.sent,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Scheduled",
      value: stats.scheduled,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="bg-card p-6 rounded-[32px] border border-border/50 shadow-xl shadow-primary/5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
                {item.title}
              </p>
              <p className="text-3xl font-black mt-1">{item.value}</p>
            </div>
            <div className={`p-3 rounded-2xl ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
