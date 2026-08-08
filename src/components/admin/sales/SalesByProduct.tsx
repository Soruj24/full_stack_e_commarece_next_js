"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSafeImageSrc } from "@/lib/utils";
import type { SalesByProduct } from "@/modules/admin/types";

interface SalesByProductProps {
  data: SalesByProduct[];
}

export function SalesByProduct({ data }: SalesByProductProps) {
  return (
    <div className="border border-border/60 rounded-xl bg-card h-full">
      <div className="p-4 border-b border-border/60">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          Top Selling Products
        </h3>
      </div>
      <div className="p-4">
        {data.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-muted-foreground">No product data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((product, i) => (
                  <TableRow key={product.productId || i}>
                    <TableCell className="text-xs font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-muted shrink-0">
                          <Image
                            src={getSafeImageSrc(product.image)}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium truncate max-w-[180px]">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {product.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      ${product.revenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
