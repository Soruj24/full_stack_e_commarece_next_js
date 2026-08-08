"use client";

import { TrendingUp, ExternalLink } from "lucide-react";
import Link from "next/link";

interface TopProduct {
  details: { name: string; images: string[] };
  totalSold: number;
  revenue: number;
}

interface TopProductsCardProps {
  products: TopProduct[];
  loading?: boolean;
}

export function TopProductsCard({ products, loading }: TopProductsCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60">
          <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-border/60">
          {[1, 2, 3, 4, 5].map((i) => (
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
          <div className="p-1.5 bg-amber-500/10 rounded-lg">
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Top Products</h3>
        </div>
        <Link
          href="/admin/products"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border/60">
        {products.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No product data available
          </div>
        ) : (
          products.slice(0, 5).map((product, i) => (
            <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.details.name}</p>
                  <p className="text-xs text-muted-foreground">{product.totalSold} sold</p>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground shrink-0">
                ${product.revenue.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
