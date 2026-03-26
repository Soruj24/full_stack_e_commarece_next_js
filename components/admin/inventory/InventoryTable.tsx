"use client";

import Image from "next/image";
import { Edit3, Trash2, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/models/Product";
import { cn } from "@/lib/utils";

interface InventoryTableProps {
  products: IProduct[];
  loading: boolean;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

export function InventoryTable({ products, loading, onEdit, onDelete }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-muted/30">
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Product Details
            </th>
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Category
            </th>
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Price
            </th>
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Stock Level
            </th>
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Status
            </th>
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  className="animate-pulse border-b border-border/50"
                >
                  <td colSpan={6} className="p-8">
                    <div className="h-12 bg-muted rounded-2xl" />
                  </td>
                </tr>
              ))
            : products.map((product: IProduct) => (
                <tr
                  key={String(product._id)}
                  className="hover:bg-muted/10 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden relative border border-border/50">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-sm group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          SKU:{" "}
                          {String(product._id).slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-muted-foreground">
                      {typeof product.category === "object"
                        ? (product.category as { name?: string })?.name
                        : "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-sm">
                      ${product.price.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            product.stock > 50
                              ? "bg-green-500"
                              : product.stock > 10
                                ? "bg-orange-500"
                                : "bg-destructive",
                          )}
                          style={{
                            width: `${Math.min(100, (product.stock / 100) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-black">
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge
                      className={cn(
                        "rounded-full px-3 py-0.5 border-none font-bold text-[10px] uppercase tracking-widest",
                        product.stock > 10
                          ? "bg-green-500/10 text-green-500"
                          : product.stock > 0
                            ? "bg-orange-500/10 text-orange-500"
                            : "bg-destructive/10 text-destructive",
                      )}
                    >
                      {product.stock > 10
                        ? "In Stock"
                        : product.stock > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-xl hover:bg-primary/10 hover:text-primary"
                        onClick={() => onEdit(product)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(String(product._id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-xl"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}