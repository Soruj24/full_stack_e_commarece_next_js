"use client";

import { Search, X, Download, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { OrderFilters as Filters } from "./useOrdersManager";

interface OrdersFiltersProps {
  filters: Filters;
  totalOrders: number;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
  onExport: () => void;
}

export function OrdersFilters({
  filters,
  totalOrders,
  onFilterChange,
  onReset,
  onExport,
}: OrdersFiltersProps) {
  const hasActiveFilters =
    !!filters.search ||
    filters.orderStatus !== "all" ||
    filters.paymentStatus !== "all" ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer name, email..."
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
            value={filters.orderStatus}
            onChange={(e) => onFilterChange("orderStatus", e.target.value)}
            className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>

          <select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange("paymentStatus", e.target.value)}
            className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
            className="h-9 w-36 rounded-lg bg-muted/50 border-border/60 text-sm"
            placeholder="From"
          />
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange("dateTo", e.target.value)}
            className="h-9 w-36 rounded-lg bg-muted/50 border-border/60 text-sm"
            placeholder="To"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="h-9 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>

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
            Showing <span className="font-medium text-foreground">{totalOrders}</span> order
            {totalOrders !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
