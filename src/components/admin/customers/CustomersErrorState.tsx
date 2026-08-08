"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/ui/EmptyState";

interface CustomersErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function CustomersErrorState({ error, onRetry }: CustomersErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Failed to load customers"
      description={error}
      action={
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      }
    />
  );
}
