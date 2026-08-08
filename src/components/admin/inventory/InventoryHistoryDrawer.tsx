"use client";

import { X, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StockAdjustment } from "./useInventoryManager";
import { cn } from "@/lib/utils";

interface InventoryHistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: StockAdjustment[];
}

export function InventoryHistoryDrawer({
  open,
  onOpenChange,
  history,
}: InventoryHistoryDrawerProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card border-l border-border/60 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div>
            <h2 className="text-base font-semibold">Stock Adjustment History</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{history.length} adjustment{history.length !== 1 ? "s" : ""} recorded</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                <Minus className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">No adjustments yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Stock adjustments will appear here as they are made.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {history.map((item, i) => {
                const diff = item.newStock - item.previousStock;
                const isIncrease = diff > 0;
                const isDecrease = diff < 0;

                return (
                  <div
                    key={`${item.productId}-${item.timestamp}-${i}`}
                    className="p-3 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            isIncrease
                              ? "bg-emerald-500/10"
                              : isDecrease
                                ? "bg-red-500/10"
                                : "bg-muted/50"
                          )}
                        >
                          {isIncrease ? (
                            <ArrowUp className="h-4 w-4 text-emerald-500" />
                          ) : isDecrease ? (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <Minus className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {isIncrease ? "+" : ""}{diff} units
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {item.previousStock} → {item.newStock}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                        {item.reason}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
