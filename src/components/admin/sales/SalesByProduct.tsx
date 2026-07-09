"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSafeImageSrc } from "@/lib/utils";
import type { SalesByProduct } from "@/modules/admin/types";

interface SalesByProductProps {
  data: SalesByProduct[];
}

export function SalesByProduct({ data }: SalesByProductProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-8">Top Selling Products</h3>
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No product data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
      <h3 className="text-xl font-black tracking-tight mb-8">Top Selling Products</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Qty Sold</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product, i) => (
              <TableRow key={product.productId || i}>
                <TableCell className="font-black text-muted-foreground">
                  #{i + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={getSafeImageSrc(product.image)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-bold">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.category}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {product.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-bold text-primary">
                  ${product.revenue.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
