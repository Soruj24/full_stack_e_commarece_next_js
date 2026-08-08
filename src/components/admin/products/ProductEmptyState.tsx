"use client";

import { Package, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Button } from "@/components/ui/button";

interface ProductEmptyStateProps {
  hasFilters: boolean;
  onAddProduct: () => void;
  onClearFilters: () => void;
}

export function ProductEmptyState({
  hasFilters,
  onAddProduct,
  onClearFilters,
}: ProductEmptyStateProps) {
  return (
    <EmptyState
      icon={Package}
      title={hasFilters ? "No products match your filters" : "No products yet"}
      description={
        hasFilters
          ? "Try adjusting your filters or search terms to find what you're looking for."
          : "Get started by adding your first product to the catalog."
      }
      action={
        hasFilters ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClearFilters} className="h-9 text-sm">
              Clear Filters
            </Button>
            <Button onClick={onAddProduct} className="h-9 text-sm gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Product
            </Button>
          </div>
        ) : (
          <Button onClick={onAddProduct} className="h-9 text-sm gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        )
      }
    />
  );
}
