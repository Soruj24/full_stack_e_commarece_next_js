"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EcommerceStatsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    activeUsers: number;
    lowStockCount: number;
  };
}

export function EcommerceStats({ stats }: EcommerceStatsProps) {
  const items = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      description: "Lifetime earnings"
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      description: "Successful transactions"
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
      description: "Inventory items"
    },
    {
      label: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      description: "Current active accounts"
    },
    {
      label: "Low Stock",
      value: stats.lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      color: stats.lowStockCount > 0 ? "text-destructive" : "text-emerald-600",
      bgColor: stats.lowStockCount > 0 ? "bg-destructive/10" : "bg-emerald-500/10",
      description: "Items needing restock"
    },
    {
      label: "Avg Order Value",
      value: `$${(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      description: "Revenue per order"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border-none shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", item.bgColor)}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {item.label}
                </span>
                <span className="text-xl font-black text-foreground tracking-tight">
                  {item.value}
                </span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground font-medium">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
