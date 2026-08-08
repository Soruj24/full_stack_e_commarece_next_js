"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProductFilters as Filters } from "./useProductsManager";
import type { ICategory } from "@/shared/types";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  filters: Filters;
  categories: ICategory[];
  totalProducts: number;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
}

export function ProductFilters({
  filters,
  categories,
  totalProducts,
  onFilterChange,
  onReset,
}: ProductFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.status !== "all" ||
    filters.stock !== "all" ||
    filters.priceMin ||
    filters.priceMax;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or tag..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-9 h-9 rounded-lg bg-muted/50 border-border/60 text-sm"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="featured">Featured</option>
          </select>

          <select
            value={filters.stock}
            onChange={(e) => onFilterChange("stock", e.target.value)}
            className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => onFilterChange("priceMin", e.target.value)}
              className="h-9 w-20 rounded-lg bg-muted/50 border-border/60 text-sm"
              min="0"
            />
            <span className="text-muted-foreground text-xs">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => onFilterChange("priceMax", e.target.value)}
              className="h-9 w-20 rounded-lg bg-muted/50 border-border/60 text-sm"
              min="0"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>
            Showing <span className="font-medium text-foreground">{totalProducts}</span> product
            {totalProducts !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
