"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        {query ? (
          <Search className="w-8 h-8 text-muted-foreground/50" />
        ) : (
          <SlidersHorizontal className="w-8 h-8 text-muted-foreground/50" />
        )}
      </div>
      <h2 className="text-2xl font-bold mb-2">
        {query ? "No Results Found" : "No Products Match Your Filters"}
      </h2>
      <p className="text-muted-foreground mb-2 max-w-md mx-auto">
        {query
          ? `We couldn't find anything for "${query}". Try different keywords or check your spelling.`
          : "Try adjusting or clearing your filters to see more products."}
      </p>
      <div className="flex items-center justify-center gap-2 mt-6">
        {query && (
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Go Back
          </Button>
        )}
        {hasActiveFilters && onResetFilters && (
          <Button variant="default" onClick={onResetFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </motion.div>
  );
}
