"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CustomerFilters as Filters } from "./useCustomersManager";

interface CustomersFiltersProps {
  filters: Filters;
  totalUsers: number;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
}

export function CustomersFilters({
  filters,
  totalUsers,
  onFilterChange,
  onReset,
}: CustomersFiltersProps) {
  const hasActiveFilters =
    !!filters.search ||
    filters.role !== "all" ||
    filters.status !== "all" ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
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
            value={filters.role}
            onChange={(e) => onFilterChange("role", e.target.value)}
            className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="vendor">Vendor</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>

          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
            className="h-9 w-36 rounded-lg bg-muted/50 border-border/60 text-sm"
          />
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange("dateTo", e.target.value)}
            className="h-9 w-36 rounded-lg bg-muted/50 border-border/60 text-sm"
          />

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
            Showing <span className="font-medium text-foreground">{totalUsers}</span> customer
            {totalUsers !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
