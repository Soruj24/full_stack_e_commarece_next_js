"use client";

import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/ui/EmptyState";

interface CustomersEmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export function CustomersEmptyState({ hasFilters, onReset }: CustomersEmptyStateProps) {
  return (
    <EmptyState
      icon={Users}
      title={hasFilters ? "No matching customers" : "No customers yet"}
      description={
        hasFilters
          ? "No customers match your current filters. Try adjusting your search criteria."
          : "There are no customers registered yet. Users will appear here after signing up."
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
