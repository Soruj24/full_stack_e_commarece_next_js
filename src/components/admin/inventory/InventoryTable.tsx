"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  History,
  Eye,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IProduct } from "@/shared/types";
import type { InventorySortField, SortDirection } from "./useInventoryManager";
import { cn } from "@/lib/utils";

interface InventoryTableProps {
  products: IProduct[];
  loading: boolean;
  sort: { field: InventorySortField; direction: SortDirection };
  selectedIds: Set<string>;
  onSort: (field: InventorySortField) => void;
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  onAdjustStock: (product: IProduct) => void;
  onViewHistory: () => void;
}

function SortHeader({
  label,
  field,
  currentSort,
  onSort,
  className,
}: {
  label: string;
  field: InventorySortField;
  currentSort: { field: InventorySortField; direction: SortDirection };
  onSort: (field: InventorySortField) => void;
  className?: string;
}) {
  const isActive = currentSort.field === field;
  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        "flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors",
        className
      )}
    >
      {label}
      {isActive ? (
        currentSort.direction === "asc" ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )
      ) : null}
    </button>
  );
}

function StockBadge({ status, stock, threshold }: { status: string; stock: number; threshold: number }) {
  if (status === "out_of_stock" || stock === 0) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="text-xs font-medium text-red-600 dark:text-red-400">Out of Stock</span>
      </div>
    );
  }
  if (status === "low_stock" || stock <= threshold) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Low Stock</span>
        <span className="text-[10px] text-muted-foreground">({stock}/{threshold})</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">In Stock</span>
    </div>
  );
}

function StockBar({ stock, threshold }: { stock: number; threshold: number }) {
  if (threshold <= 0) threshold = 10;
  const pct = Math.min((stock / (threshold * 3)) * 100, 100);
  const isLow = stock <= threshold;
  const isOut = stock === 0;

  return (
    <div className="w-20">
      <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isOut ? "bg-red-400" : isLow ? "bg-amber-400" : "bg-emerald-400"
          )}
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
    </div>
  );
}

function InventoryRow({
  product,
  isSelected,
  onSelect,
  onAdjustStock,
}: {
  product: IProduct;
  isSelected: boolean;
  onSelect: () => void;
  onAdjustStock: () => void;
}) {
  const [open, setOpen] = useState(false);
  const threshold = product.lowStockThreshold || 10;
  const reserved = 0;
  const available = Math.max(0, product.stock - reserved);
  const price = product.discountPrice || product.price;

  return (
    <tr
      className={cn(
        "border-b border-border/60 transition-colors",
        isSelected ? "bg-primary/5" : "hover:bg-muted/30"
      )}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 rounded border-border/60 accent-primary cursor-pointer"
        />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-muted/50 border border-border/60 overflow-hidden shrink-0">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
              {product.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {product.category?.name || "Uncategorized"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="text-xs font-mono text-muted-foreground">
          {product.sku || "—"}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">{product.stock}</span>
          <StockBar stock={product.stock} threshold={threshold} />
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="text-xs text-muted-foreground tabular-nums">{reserved}</span>
      </td>

      <td className="px-4 py-3">
        <span className={cn(
          "text-sm font-medium tabular-nums",
          available === 0 ? "text-red-500" : available <= threshold ? "text-amber-600" : "text-foreground"
        )}>
          {available}
        </span>
      </td>

      <td className="px-4 py-3">
        <StockBadge status={product.stockStatus} stock={product.stock} threshold={threshold} />
      </td>

      <td className="px-4 py-3">
        <span className="text-sm font-medium tabular-nums">${price.toFixed(2)}</span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onAdjustStock}
            title="Adjust stock"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setOpen(!open)}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-border/60 bg-card shadow-lg py-1">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => { onAdjustStock(); setOpen(false); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Adjust Stock
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <History className="h-3.5 w-3.5" />
                    View History
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} className="border-b border-border/60 animate-pulse">
          <td className="px-4 py-3">
            <div className="h-4 w-4 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted/50" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 bg-muted/50 rounded" />
                <div className="h-3 w-20 bg-muted/30 rounded" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="h-3.5 w-16 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-12 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-3.5 w-6 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-3.5 w-8 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-20 bg-muted/50 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="h-3.5 w-12 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-1">
              <div className="h-7 w-7 bg-muted/50 rounded-lg" />
              <div className="h-7 w-7 bg-muted/50 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function InventoryTable({
  products,
  loading,
  sort,
  selectedIds,
  onSort,
  onSelectAll,
  onSelectOne,
  onAdjustStock,
}: InventoryTableProps) {
  const allSelected = products.length > 0 && selectedIds.size === products.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < products.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card border-b border-border/60">
          <tr>
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected; }}
                onChange={onSelectAll}
                className="h-4 w-4 rounded border-border/60 accent-primary cursor-pointer"
              />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Product" field="name" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="SKU" field="sku" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Stock" field="stock" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Reserved
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Available
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Status" field="stockStatus" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Price" field="price" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-right">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {loading ? (
            <TableSkeleton />
          ) : products.length === 0 ? null : (
            products.map((product) => (
              <InventoryRow
                key={String(product._id)}
                product={product}
                isSelected={selectedIds.has(String(product._id))}
                onSelect={() => onSelectOne(String(product._id))}
                onAdjustStock={() => onAdjustStock(product)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
