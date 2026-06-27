"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, CheckCircle, Ban } from "lucide-react";

interface UsersStatsProps {
  stats: {
    total: number;
    admins: number;
    active: number;
    banned: number;
  };
}

export function UsersStats({ stats }: UsersStatsProps) {
  const statItems = [
    {
      title: "Total Users",
      value: stats.total,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Administrators",
      value: stats.admins,
      icon: Shield,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Active Users",
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Banned Users",
      value: stats.banned,
      icon: Ban,
      color: "text-red-500",
      bg: "bg-red-500/10",
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
