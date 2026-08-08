"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function OrdersErrorState({ message, onRetry }: OrdersErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-2xl bg-destructive/10 mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-base font-medium text-foreground mb-1">
        Failed to load orders
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>
      <Button
        variant="outline"
        onClick={onRetry}
        className="h-9 text-sm gap-1.5"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </Button>
    </div>
  );
}
