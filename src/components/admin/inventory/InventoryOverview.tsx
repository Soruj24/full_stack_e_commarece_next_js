"use client";

import { Package, AlertTriangle, XCircle, CheckCircle, DollarSign, Layers } from "lucide-react";

interface InventoryStats {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  inventoryValue: number;
  totalUnits: number;
}

interface InventoryOverviewProps {
  stats: InventoryStats;
}

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`border rounded-xl p-4 bg-card transition-colors ${
        accent ? "border-amber-300/40 dark:border-amber-500/20" : "border-border/60"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export function InventoryOverview({ stats }: InventoryOverviewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <KpiCard
        label="Total Products"
        value={stats.totalProducts.toLocaleString()}
        icon={Package}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
      />
      <KpiCard
        label="In Stock"
        value={stats.inStock.toLocaleString()}
        icon={CheckCircle}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
      />
      <KpiCard
        label="Low Stock"
        value={stats.lowStock.toLocaleString()}
        icon={AlertTriangle}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-600"
        accent={stats.lowStock > 0}
      />
      <KpiCard
        label="Out of Stock"
        value={stats.outOfStock.toLocaleString()}
        icon={XCircle}
        iconBg="bg-red-500/10"
        iconColor="text-red-500"
        accent={stats.outOfStock > 0}
      />
      <KpiCard
        label="Total Units"
        value={stats.totalUnits.toLocaleString()}
        icon={Layers}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-500"
      />
      <KpiCard
        label="Inventory Value"
        value={`$${stats.inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        icon={DollarSign}
        iconBg="bg-cyan-500/10"
        iconColor="text-cyan-500"
      />
    </div>
  );
}
