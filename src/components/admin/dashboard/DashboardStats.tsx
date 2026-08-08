"use client";

import { StatCard } from "@/components/admin/ui/StatCard";
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, BarChart3 } from "lucide-react";

interface StatsProps {
  activeUsers: number;
  totalAdmins: number;
  bannedUsers: number;
}

export function DashboardStats({ activeUsers, totalAdmins, bannedUsers }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      <StatCard
        label="Customers"
        value={activeUsers.toLocaleString()}
        icon={Users}
        iconColor="text-blue-500"
        change="+12%"
        changeType="positive"
      />
      <StatCard
        label="Orders"
        value={(activeUsers * 2.3).toFixed(0)}
        icon={ShoppingBag}
        iconColor="text-indigo-500"
      />
      <StatCard
        label="Revenue"
        value={`$${(activeUsers * 147.5).toFixed(2)}`}
        icon={DollarSign}
        iconColor="text-emerald-500"
        change="+8%"
        changeType="positive"
      />
      <StatCard
        label="Conversion"
        value="3.24%"
        icon={TrendingUp}
        iconColor="text-amber-500"
        change="+0.5%"
        changeType="positive"
      />
      <StatCard
        label="Admins"
        value={totalAdmins}
        icon={Users}
        iconColor="text-violet-500"
      />
      <StatCard
        label="Products"
        value={Math.floor(activeUsers * 0.8)}
        icon={Package}
        iconColor="text-rose-500"
      />
    </div>
  );
}
