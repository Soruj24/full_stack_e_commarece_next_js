"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/ui/EmptyState";

interface ReviewsEmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export function ReviewsEmptyState({ hasFilters, onReset }: ReviewsEmptyStateProps) {
  return (
    <EmptyState
      icon={MessageSquare}
      title={hasFilters ? "No matching reviews" : "No reviews yet"}
      description={hasFilters ? "No reviews match your current filters." : "Customer reviews will appear here once submitted."}
      action={hasFilters ? <Button variant="outline" size="sm" onClick={onReset}>Clear Filters</Button> : undefined}
    />
  );
}
