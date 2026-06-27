"use client";

import React from "react";
import { Tag, Package, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  "Under $500": <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  "New Arrivals": <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  "Top Rated": <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
  Cybernetics: <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
};

interface FilterChipsProps {
  filters: { label: string; query: string }[];
  selectedIndex: number;
  offset: number;
  onSelect: (index: number) => void;
  onClick: (query: string) => void;
}

export function FilterChips({ filters, selectedIndex, offset, onSelect, onClick }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-2 -mx-1 px-1">
      {filters.map((filter, i) => {
        const globalIndex = offset + i;
        const isSelected = selectedIndex === globalIndex;
        return (
          <button
            key={filter.label}
            onMouseEnter={() => onSelect(globalIndex)}
            onClick={() => onClick(filter.query)}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
              isSelected
                ? "bg-primary text-white border-primary"
                : "bg-muted/50 border-border/40 hover:bg-primary/10 hover:border-primary/30",
            )}
          >
            {ICON_MAP[filter.label]}
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
