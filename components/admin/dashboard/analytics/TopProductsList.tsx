"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { getSafeImageSrc } from "@/lib/utils";
import { AnalyticsData } from "@/types/analytics";

interface TopProductsListProps {
  data: AnalyticsData["topProducts"];
}

export function TopProductsList({ data }: TopProductsListProps) {
  return (
    <div className="p-10 rounded-[48px] bg-card border border-border/50 shadow-2xl shadow-primary/5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black tracking-tighter">
            Top <span className="text-primary">Products</span>
          </h3>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Best selling items by quantity
          </p>
        </div>
        <div className="p-3 bg-muted/50 rounded-2xl">
          <Package className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-6">
        {(data || []).map((product, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden relative">
                <Image src={getSafeImageSrc(product.details.images[0])} alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm group-hover:text-primary transition-colors">
                  {product.details.name}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {product.totalSold} Units Sold
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-sm text-primary">${product.revenue.toFixed(2)}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
