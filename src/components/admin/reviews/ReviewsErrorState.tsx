"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/ui/EmptyState";

interface ReviewsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ReviewsErrorState({ error, onRetry }: ReviewsErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Failed to load reviews"
      description={error}
      action={<Button variant="outline" size="sm" onClick={onRetry}>Try Again</Button>}
    />
  );
}
