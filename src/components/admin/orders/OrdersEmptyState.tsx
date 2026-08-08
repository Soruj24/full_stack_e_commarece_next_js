"use client";

import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/admin/ui/EmptyState";

interface OrdersEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function OrdersEmptyState({ hasFilters, onClearFilters }: OrdersEmptyStateProps) {
  return (
    <EmptyState
      icon={ShoppingBag}
      title={hasFilters ? "No orders match your filters" : "No orders yet"}
      description={
        hasFilters
          ? "Try adjusting your filters or search terms to find what you're looking for."
          : "Orders will appear here once customers start placing them."
      }
      action={
        hasFilters ? (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear Filters
          </button>
        ) : null
      }
    />
  );
}
