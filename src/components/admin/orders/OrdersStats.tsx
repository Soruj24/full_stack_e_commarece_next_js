"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Clock, Truck, CheckCircle, DollarSign } from "lucide-react";

interface OrdersStatsProps {
  stats: {
    total: number;
    pending: number;
    shipped: number;
    delivered: number;
    totalRevenue: number;
  };
}

export function OrdersStats({ stats }: OrdersStatsProps) {
  const statItems = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: ShoppingBag,
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
      title: "Shipped",
      value: stats.shipped,
      icon: Truck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item) => (
        <Card key={item.title} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <p className="text-2xl font-black mt-1">{item.value}</p>
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
