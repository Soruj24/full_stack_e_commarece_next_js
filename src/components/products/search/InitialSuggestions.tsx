"use client";

import { History, TrendingUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface InitialSuggestionsProps {
  recentSearches: string[];
  popularSearches: string[];
  selectedIndex: number;
  filterCount: number;
  onSelect: (index: number) => void;
  onClick: (term: string) => void;
  onClearRecent: () => void;
}

export function InitialSuggestions({
  recentSearches, popularSearches, selectedIndex, filterCount,
  onSelect, onClick, onClearRecent,
}: InitialSuggestionsProps) {
  return (
    <>
      {recentSearches.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1 sm:px-2">
            <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5 sm:gap-2">
              <History className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Recent Expeditions
            </h4>
            <button onClick={onClearRecent} className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-primary hover:underline">
              Clear Log
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {recentSearches.map((term, i) => {
              const globalIndex = filterCount + i;
              const isSelected = selectedIndex === globalIndex;
              return (
                <button
                  key={term}
                  onMouseEnter={() => onSelect(globalIndex)}
                  onClick={() => onClick(term)}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border transition-all text-[10px] sm:text-xs font-bold",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 border-border/40 hover:bg-primary/10 hover:border-primary/30",
                  )}
                >
                  {term}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <h4 className="px-1 sm:px-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5 sm:gap-2">
          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Trending Protocols
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
          {popularSearches.map((term, i) => {
            const globalIndex = filterCount + recentSearches.length + i;
            const isSelected = selectedIndex === globalIndex;
            return (
              <button
                key={term}
                onMouseEnter={() => onSelect(globalIndex)}
                onClick={() => onClick(term)}
                className={cn(
                  "flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all text-left group",
                  isSelected
                    ? "bg-primary/10 border-primary/30"
                    : "hover:bg-primary/5 border-transparent hover:border-primary/10",
                )}
              >
                <div className={cn("p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-transform", isSelected ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary group-hover:scale-110")}>
                  <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className={cn("font-bold text-xs sm:text-sm", isSelected ? "text-primary" : "")}>{term}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
