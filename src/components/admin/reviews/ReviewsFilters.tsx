"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ReviewFilters as Filters } from "./useReviewsManager";

interface ReviewsFiltersProps {
  filters: Filters;
  totalReviews: number;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
}

export function ReviewsFilters({ filters, totalReviews, onFilterChange, onReset }: ReviewsFiltersProps) {
  const hasActiveFilters = !!filters.search || filters.rating !== "all";

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews, products, users..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-9 h-9 rounded-lg bg-muted/50 border-border/60 text-sm"
          />
          {filters.search && (
            <button onClick={() => onFilterChange("search", "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filters.rating}
            onChange={(e) => onFilterChange("rating", e.target.value)}
            className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-9 text-xs text-muted-foreground hover:text-foreground">
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
            Showing <span className="font-medium text-foreground">{totalReviews}</span> review{totalReviews !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
