"use client";

import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/ui/EmptyState";

interface InventoryEmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export function InventoryEmptyState({ hasFilters, onReset }: InventoryEmptyStateProps) {
  return (
    <EmptyState
      icon={Package}
      title={hasFilters ? "No matching products" : "No products in inventory"}
      description={
        hasFilters
          ? "No products match your current filters. Try adjusting your search criteria."
          : "Add products to start managing inventory."
      }
      action={
        hasFilters ? (
          <Button variant="outline" size="sm" onClick={onReset}>
            Clear Filters
          </Button>
        ) : undefined
      }
    />
  );
}
