"use client";

import type { TopCategory } from "./useAnalyticsManager";

interface TopCategoriesTableProps {
  categories: TopCategory[];
}

export function AnalyticsTopCategories({ categories }: TopCategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="border border-border/60 rounded-xl p-6 bg-card">
        <p className="text-sm font-medium mb-1">Top Categories</p>
        <p className="text-xs text-muted-foreground">No category data for this period</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...categories.map((c) => c.revenue));

  return (
    <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
      <div className="p-4 border-b border-border/60">
        <p className="text-sm font-medium">Top Categories</p>
        <p className="text-xs text-muted-foreground mt-0.5">By revenue in selected period</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border/60">
            <tr>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Orders
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-4 py-2.5 w-24" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {categories.map((cat, i) => (
              <tr key={cat._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5">
                  <span className="text-xs font-medium text-muted-foreground">{i + 1}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-sm font-medium">{cat._id}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-xs tabular-nums">{cat.orders}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-sm font-medium tabular-nums">
                    ${cat.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-foreground/15"
                      style={{ width: `${(cat.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
