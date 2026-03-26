"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchEmptyStateProps {
  query: string;
  hasActiveFilters: boolean;
  onResetFilters?: () => void;
}

export function SearchEmptyState({
  query,
  hasActiveFilters,
  onResetFilters,
}: SearchEmptyStateProps) {
  return (
    <div className="text-center py-20">
      <Search className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
      <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
      <p className="text-muted-foreground mb-6">
        Try adjusting your search or filters
      </p>
      {hasActiveFilters && onResetFilters && (
        <Button variant="outline" onClick={onResetFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
