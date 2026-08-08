"use client";

import { Trash2, CheckCircle, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

interface ProductBulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkStatusChange: (isActive: boolean) => void;
  onClearSelection: () => void;
}

export function ProductBulkActions({
  selectedCount,
  onBulkDelete,
  onBulkStatusChange,
  onClearSelection,
}: ProductBulkActionsProps) {
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
          onClick={() => onBulkStatusChange(true)}
          className="h-8 text-xs gap-1.5"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Activate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusChange(false)}
          className="h-8 text-xs gap-1.5"
        >
          <XCircle className="h-3.5 w-3.5" />
          Deactivate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDelete}
          className="h-8 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
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
