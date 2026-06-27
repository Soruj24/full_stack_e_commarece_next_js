"use client";

import { Layers, CheckCircle, FolderTree } from "lucide-react";

interface CategoriesStatsProps {
  total: number;
  topLevel: number;
  subcategories: number;
  active?: number;
}

export function CategoriesStats({ total, topLevel, subcategories, active }: CategoriesStatsProps) {
  const stats = [
    { label: "Total Categories", value: total, color: "bg-primary/10 text-primary", icon: Layers },
    { label: "Top Level", value: topLevel, color: "bg-blue-500/10 text-blue-500", icon: FolderTree },
    { label: "Subcategories", value: subcategories, color: "bg-orange-500/10 text-orange-500", icon: Layers },
    ...(active !== undefined ? [{ label: "Active", value: active, color: "bg-green-500/10 text-green-500", icon: CheckCircle }] : []),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-card p-6 rounded-[32px] border border-border/50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}