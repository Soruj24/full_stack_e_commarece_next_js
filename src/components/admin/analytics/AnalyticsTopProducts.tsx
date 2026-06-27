"use client";

import { ArrowUpRight } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  salesCount: number;
  price: number;
}

interface AnalyticsTopProductsProps {
  products: Product[];
}

export function AnalyticsTopProducts({ products }: AnalyticsTopProductsProps) {
  return (
    <div className="bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
      <h3 className="text-xl font-black tracking-tight mb-8">
        Top Selling Products
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                Product Name
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                Price
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                Sales
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                Revenue
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground text-right">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {products.map((product, i) => (
              <tr
                key={i}
                className="group hover:bg-muted/30 transition-colors"
              >
                <td className="py-4 font-bold">{product.name}</td>
                <td className="py-4 font-bold">${product.price}</td>
                <td className="py-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black">
                    {product.salesCount || 0} units
                  </span>
                </td>
                <td className="py-4 font-bold">
                  $
                  {(
                    (product.salesCount || 0) * product.price
                  ).toLocaleString()}
                </td>
                <td className="py-4 text-right">
                  <span className="text-emerald-600 font-bold text-xs flex items-center justify-end">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +15%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}