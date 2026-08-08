"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  MoreHorizontal,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import type { IProduct } from "@/shared/types";
import type { SortField, SortDirection } from "./useProductsManager";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: IProduct[];
  loading: boolean;
  sort: { field: SortField; direction: SortDirection };
  selectedIds: Set<string>;
  onSort: (field: SortField) => void;
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

function SortHeader({
  label,
  field,
  currentSort,
  onSort,
}: {
  label: string;
  field: SortField;
  currentSort: { field: SortField; direction: SortDirection };
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort.field === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
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

function ProductRow({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  product: IProduct;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const stockStatus =
    product.stock === 0
      ? "out_of_stock"
      : product.stock <= 10
        ? "low_stock"
        : "in_stock";

  const stockLabel =
    stockStatus === "in_stock"
      ? "In Stock"
      : stockStatus === "low_stock"
        ? "Low Stock"
        : "Out of Stock";

  const stockVariant =
    stockStatus === "in_stock"
      ? "success"
      : stockStatus === "low_stock"
        ? "warning"
        : "danger";

  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  return (
    <tr
      className={cn(
        "border-b border-border/60 transition-colors group",
        isSelected ? "bg-primary/5" : "hover:bg-muted/30"
      )}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="h-4 w-4 rounded border-border/60 text-primary focus:ring-primary/20 cursor-pointer"
          />
          <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden relative border border-border/60 shrink-0">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                N/A
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
              {product.name}
            </p>
            <p className="text-xs text-muted-foreground">
              SKU: {product.sku || String(product._id).slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {typeof product.category === "object"
            ? (product.category as { name?: string })?.name || "Uncategorized"
            : "Uncategorized"}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-col">
          {discountPercent > 0 ? (
            <>
              <span className="text-xs text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-foreground">
                ${product.discountPrice!.toFixed(2)}
                <span className="ml-1 text-xs text-emerald-600">
                  -{discountPercent}%
                </span>
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-foreground">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-muted/50 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                stockStatus === "in_stock" && "bg-emerald-500",
                stockStatus === "low_stock" && "bg-amber-500",
                stockStatus === "out_of_stock" && "bg-red-500"
              )}
              style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium text-foreground w-8 text-right">
            {product.stock}
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <StatusBadge variant={stockVariant} dot>
          {stockLabel}
        </StatusBadge>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {product.isFeatured && (
            <StatusBadge variant="info">Featured</StatusBadge>
          )}
          {product.isActive && !product.isFeatured && (
            <StatusBadge variant="success">Active</StatusBadge>
          )}
          {product.isArchived && (
            <StatusBadge variant="muted">Archived</StatusBadge>
          )}
          {!product.isActive && !product.isArchived && !product.isFeatured && (
            <StatusBadge variant="warning">Inactive</StatusBadge>
          )}
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(product)}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:text-destructive"
            onClick={() => onDelete(String(product._id))}
          >
            <Trash2 className="h-3.5 w-3.5" />
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
                <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl border border-border/60 bg-card shadow-lg py-1">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => {
                      window.open(`/products/${product.slug}`, "_blank");
                      setOpen(false);
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/products/${product.slug}`
                      );
                      toast.success("Link copied");
                      setOpen(false);
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy link
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => {
                      onEdit(product);
                      setOpen(false);
                    }}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                    onClick={() => {
                      onDelete(String(product._id));
                      setOpen(false);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
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
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-border/60 animate-pulse">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-muted/50" />
              <div className="h-10 w-10 rounded-lg bg-muted/50" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 bg-muted/50 rounded" />
                <div className="h-3 w-16 bg-muted/30 rounded" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="h-3.5 w-20 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-3.5 w-14 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 bg-muted/50 rounded-full" />
              <div className="h-3.5 w-6 bg-muted/50 rounded" />
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-16 bg-muted/50 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-14 bg-muted/50 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-1">
              <div className="h-7 w-7 bg-muted/50 rounded-lg" />
              <div className="h-7 w-7 bg-muted/50 rounded-lg" />
              <div className="h-7 w-7 bg-muted/50 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function ProductTable({
  products,
  loading,
  sort,
  selectedIds,
  onSort,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const allSelected = products.length > 0 && selectedIds.size === products.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < products.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card border-b border-border/60">
          <tr>
            <th className="px-4 py-3 text-left">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={onSelectAll}
                  className="h-4 w-4 rounded border-border/60 text-primary focus:ring-primary/20 cursor-pointer"
                />
              </div>
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Product" field="name" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Price" field="price" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Stock" field="stock" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Visibility
              </span>
            </th>
            <th className="px-4 py-3 text-right">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
              <ProductRow
                key={String(product._id)}
                product={product}
                isSelected={selectedIds.has(String(product._id))}
                onSelect={() => onSelectOne(String(product._id))}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
