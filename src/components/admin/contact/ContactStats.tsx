"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Clock, Eye, CheckCircle } from "lucide-react";

interface ContactStatsProps {
  stats: {
    total: number;
    pending: number;
    read: number;
    replied: number;
  };
}

export function ContactStats({ stats }: ContactStatsProps) {
  const statItems = [
    {
      title: "Total Messages",
      value: stats.total,
      icon: MessageSquare,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Read",
      value: stats.read,
      icon: Eye,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Replied",
      value: stats.replied,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.title} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <p className="text-3xl font-black mt-1">{item.value}</p>
              </div>
              <div className={`p-3 rounded-2xl ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
