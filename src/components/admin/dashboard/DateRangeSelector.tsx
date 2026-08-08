"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ranges = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "This year", value: "1y" },
];

interface DateRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DateRangeSelector({ value, onChange, className }: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = ranges.find((r) => r.value === value) || ranges[1];

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
      >
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        {selected.label}
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-50 w-44 rounded-xl border border-border/60 bg-card shadow-lg py-1">
            {ranges.map((range) => (
              <button
                key={range.value}
                onClick={() => { onChange(range.value); setOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors",
                  value === range.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted/50"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
