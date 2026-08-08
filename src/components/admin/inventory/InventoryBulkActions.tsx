"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InventoryBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAdjust: (adjustment: number, reason: string) => void;
}

export function InventoryBulkActions({
  selectedCount,
  onClearSelection,
  onBulkAdjust,
}: InventoryBulkActionsProps) {
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");

  if (selectedCount === 0) return null;

  const numValue = parseInt(value) || 0;
  const adjustment = mode === "add" ? numValue : -numValue;
  const isValid = numValue > 0 && reason.trim().length > 0;

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-primary/5 border-y border-primary/20">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-primary">
          {selectedCount} selected
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClearSelection}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border/60" />

      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-border/60 overflow-hidden">
          <button
            onClick={() => setMode("add")}
            className={cn(
              "px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors",
              mode === "add" ? "bg-emerald-500/10 text-emerald-600" : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
          <button
            onClick={() => setMode("subtract")}
            className={cn(
              "px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors",
              mode === "subtract" ? "bg-red-500/10 text-red-600" : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Minus className="h-3 w-3" />
            Subtract
          </button>
        </div>

        <Input
          type="number"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Qty"
          className="h-8 w-20 text-xs"
        />

        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason..."
          className="h-8 w-32 text-xs"
        />

        <Button
          size="sm"
          disabled={!isValid}
          onClick={() => {
            onBulkAdjust(adjustment, reason);
            setValue("");
            setReason("");
          }}
          className="h-8"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
