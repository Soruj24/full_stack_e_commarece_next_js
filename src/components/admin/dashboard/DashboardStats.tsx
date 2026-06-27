"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, Eye } from "lucide-react";

interface StatsProps {
  activeUsers: number;
  totalAdmins: number;
  bannedUsers: number;
}

export function DashboardStats({ activeUsers, totalAdmins, bannedUsers }: StatsProps) {
  const stats = [
    {
      label: "Total Customers",
      value: activeUsers.toLocaleString(),
      subtext: "+12% from last month",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Orders",
      value: (activeUsers * 2.3).toFixed(0),
      subtext: "This month",
      icon: ShoppingBag,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Revenue",
      value: `$${(activeUsers * 147.5).toFixed(2)}`,
      subtext: "This month",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Conversion Rate",
      value: "3.24%",
      subtext: "+0.5% from last week",
      icon: TrendingUp,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      label: "Active Admins",
      value: totalAdmins,
      subtext: "Team members",
      icon: Users,
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      label: "Products",
      value: Math.floor(activeUsers * 0.8),
      subtext: "In catalog",
      icon: Package,
      gradient: "from-rose-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className="border-none shadow-xl shadow-primary/5 bg-gradient-to-br hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
        >
          <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-muted-foreground text-sm font-medium">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black mt-1 tracking-tight text-foreground">
                  {stat.value}
                </h3>
                <p className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  {stat.subtext}
                </p>
              </div>
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
