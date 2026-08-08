"use client";

import { Search, X, SlidersHorizontal, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { InventoryFilters as Filters } from "./useInventoryManager";

interface InventoryFiltersBarProps {
  filters: Filters;
  totalProducts: number;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export function InventoryFiltersBar({
  filters,
  totalProducts,
  onFilterChange,
  onReset,
  onOpenHistory,
  historyCount,
}: InventoryFiltersBarProps) {
  const hasActiveFilters =
    !!filters.search || filters.stock !== "all" || !!filters.category;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU..."
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
            value={filters.stock}
            onChange={(e) => onFilterChange("stock", e.target.value)}
            className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

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

          <div className="w-px h-5 bg-border/60 hidden sm:block" />

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenHistory}
            className="h-9"
          >
            <History className="h-3.5 w-3.5 mr-1.5" />
            History
            {historyCount > 0 && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {historyCount}
              </span>
            )}
          </Button>
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
