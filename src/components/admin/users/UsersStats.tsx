"use client";

import { StatCard } from "@/components/admin/ui/StatCard";
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="Total Users" value={stats.total} icon={Users} iconColor="text-blue-500" />
      <StatCard label="Admins" value={stats.admins} icon={Shield} iconColor="text-violet-500" />
      <StatCard label="Active" value={stats.active} icon={CheckCircle} iconColor="text-emerald-500" />
      <StatCard label="Banned" value={stats.banned} icon={Ban} iconColor="text-red-500" />
    </div>
  );
}
