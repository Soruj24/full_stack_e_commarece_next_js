"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DatePreset } from "./useAnalyticsManager";
import { cn } from "@/lib/utils";

interface DateRangeSelectorProps {
  preset: DatePreset;
  customRange: { start: string; end: string };
  onPresetChange: (preset: DatePreset) => void;
  onCustomRangeChange: (start: string, end: string) => void;
}

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "1y", label: "1 year" },
  { key: "custom", label: "Custom" },
];

export function DateRangeSelector({
  preset,
  customRange,
  onPresetChange,
  onCustomRangeChange,
}: DateRangeSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg border border-border/60">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              onPresetChange(p.key);
              if (p.key === "custom") setShowCustom(true);
              else setShowCustom(false);
            }}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              preset === p.key
                ? "bg-card text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={customRange.start}
            onChange={(e) => onCustomRangeChange(e.target.value, customRange.end)}
            className="h-8 w-36 text-xs"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="date"
            value={customRange.end}
            onChange={(e) => onCustomRangeChange(customRange.start, e.target.value)}
            className="h-8 w-36 text-xs"
          />
        </div>
      )}
    </div>
  );
}
