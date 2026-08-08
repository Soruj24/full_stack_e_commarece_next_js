"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Minus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { IProduct } from "@/shared/types";
import { cn } from "@/lib/utils";

interface StockAdjustmentDialogProps {
  product: IProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdjust: (productId: string, newStock: number, reason: string) => void;
}

const REASONS = [
  "Restock",
  "Damaged",
  "Returned",
  "Corrected",
  "Transfer",
  "Other",
];

export function StockAdjustmentDialog({
  product,
  open,
  onOpenChange,
  onAdjust,
}: StockAdjustmentDialogProps) {
  const [mode, setMode] = useState<"set" | "add" | "subtract">("set");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    if (open) {
      setValue("");
      setReason("");
      setCustomReason("");
      setMode("set");
    }
  }, [open]);

  if (!open || !product) return null;

  const currentStock = product.stock;
  const threshold = product.lowStockThreshold || 10;

  let newStock: number;
  const numValue = parseInt(value) || 0;

  switch (mode) {
    case "add":
      newStock = currentStock + numValue;
      break;
    case "subtract":
      newStock = Math.max(0, currentStock - numValue);
      break;
    default:
      newStock = numValue;
  }

  const finalReason = reason === "Other" ? customReason : reason;
  const isValid = value !== "" && newStock >= 0 && finalReason.trim().length > 0;

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "danger" as const };
    if (stock <= threshold) return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "success" as const };
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-card border border-border/60 rounded-2xl shadow-2xl">
          <div className="p-6 border-b border-border/60">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Adjust Stock</h2>
                <p className="text-sm text-muted-foreground mt-1">{product.name}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Current Stock</p>
                <p className="text-2xl font-semibold tabular-nums mt-0.5">{currentStock}</p>
              </div>
              <div className="text-right">
                <StatusBadge variant={getStockStatus(currentStock).variant}>
                  {getStockStatus(currentStock).label}
                </StatusBadge>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Mode</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "set" as const, label: "Set To", icon: RotateCcw },
                  { key: "add" as const, label: "Add", icon: Plus },
                  { key: "subtract" as const, label: "Subtract", icon: Minus },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                      mode === key
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {mode === "set" ? "New Stock Level" : mode === "add" ? "Quantity to Add" : "Quantity to Subtract"}
              </p>
              <Input
                type="number"
                min={0}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0"
                className="h-10 text-lg font-semibold tabular-nums"
              />
            </div>

            {value !== "" && (
              <div className={cn(
                "flex items-center justify-between p-3 rounded-xl border",
                newStock === 0 ? "bg-red-500/5 border-red-300/30" : "bg-muted/30 border-border/60"
              )}>
                <span className="text-xs text-muted-foreground">New Stock Level</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold tabular-nums">{newStock}</span>
                  <StatusBadge variant={getStockStatus(newStock).variant}>
                    {getStockStatus(newStock).label}
                  </StatusBadge>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Reason</p>
              <div className="flex flex-wrap gap-1.5">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                      reason === r
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {reason === "Other" && (
                <Input
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter reason..."
                  className="h-9 mt-2 text-sm"
                />
              )}
            </div>
          </div>

          <div className="p-6 border-t border-border/60 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!isValid}
              onClick={() => {
                onAdjust(String(product._id), newStock, finalReason);
                onOpenChange(false);
              }}
            >
              Apply Adjustment
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
