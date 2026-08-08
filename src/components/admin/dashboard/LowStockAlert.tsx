"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import Link from "next/link";

interface LowStockItem {
  name: string;
  stock: number;
  category?: string;
}

interface LowStockAlertProps {
  items: LowStockItem[];
  loading?: boolean;
}

export function LowStockAlert({ items, loading }: LowStockAlertProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60">
          <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-border/60">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-4">
              <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-500/10 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Low Stock Alerts</h3>
        </div>
        <Link
          href="/admin/products?filter=low-stock"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border/60">
        {items.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            All products are well stocked
          </div>
        ) : (
          items.slice(0, 5).map((item, i) => (
            <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                {item.category && (
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                )}
              </div>
              <StatusBadge variant={item.stock === 0 ? "danger" : "warning"}>
                {item.stock} left
              </StatusBadge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
