"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-muted-foreground font-medium">Active filters:</span>
      {filters.map((f) => (
        <Badge key={f.key} variant="secondary" size="sm" className="gap-1">
          {f.label}: {f.value}
          <button onClick={() => onRemove(f.key)} className="ml-0.5 hover:text-destructive transition-colors">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs h-6 px-2">
        Clear all
      </Button>
    </div>
  );
}
