"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/ui/EmptyState";

interface InventoryErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function InventoryErrorState({ error, onRetry }: InventoryErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Failed to load inventory"
      description={error}
      action={
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      }
    />
  );
}
