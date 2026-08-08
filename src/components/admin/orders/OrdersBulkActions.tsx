"use client";

import { Truck, CheckCircle, XCircle, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

interface OrdersBulkActionsProps {
  selectedCount: number;
  onBulkStatusChange: (status: string) => void;
  onClearSelection: () => void;
}

export function OrdersBulkActions({
  selectedCount,
  onBulkStatusChange,
  onClearSelection,
}: OrdersBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border-b border-primary/10">
      <div className="flex items-center gap-2">
        <StatusBadge variant="default">
          {selectedCount} selected
        </StatusBadge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusChange("processing")}
          className="h-8 text-xs gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Processing
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusChange("shipped")}
          className="h-8 text-xs gap-1.5"
        >
          <Truck className="h-3.5 w-3.5" />
          Shipped
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusChange("delivered")}
          className="h-8 text-xs gap-1.5"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Delivered
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusChange("cancelled")}
          className="h-8 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <XCircle className="h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onClearSelection}
        className="h-7 w-7 ml-auto"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
