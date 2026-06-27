"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Ticket, Percent, DollarSign, CheckCircle } from "lucide-react";

interface CouponsStatsProps {
  stats: {
    total: number;
    active: number;
    percentage: number;
    fixed: number;
  };
}

export function CouponsStats({ stats }: CouponsStatsProps) {
  const statItems = [
    {
      title: "Total Coupons",
      value: stats.total,
      icon: Ticket,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Coupons",
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Percentage Discounts",
      value: stats.percentage,
      icon: Percent,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Fixed Discounts",
      value: stats.fixed,
      icon: DollarSign,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
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
