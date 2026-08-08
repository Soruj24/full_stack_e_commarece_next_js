"use client";

import { StatCard } from "@/components/admin/ui/StatCard";
import { Users, Shield, CheckCircle, Ban, UserCheck, KeyRound } from "lucide-react";

interface CustomersStatsProps {
  stats: {
    total: number;
    admins: number;
    active: number;
    banned: number;
    verified: number;
    with2FA: number;
  };
}

export function CustomersStats({ stats }: CustomersStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      <StatCard label="Total Users" value={stats.total} icon={Users} iconColor="text-blue-500" />
      <StatCard label="Admins" value={stats.admins} icon={Shield} iconColor="text-violet-500" />
      <StatCard label="Active" value={stats.active} icon={CheckCircle} iconColor="text-emerald-500" />
      <StatCard label="Banned" value={stats.banned} icon={Ban} iconColor="text-red-500" />
      <StatCard label="Verified" value={stats.verified} icon={UserCheck} iconColor="text-cyan-500" />
      <StatCard label="With 2FA" value={stats.with2FA} icon={KeyRound} iconColor="text-amber-500" />
    </div>
  );
}
