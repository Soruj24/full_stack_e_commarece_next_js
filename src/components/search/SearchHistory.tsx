"use client";

import { Clock, X } from "lucide-react";

interface SearchHistoryProps {
  searches: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
  onRemove: (query: string) => void;
}

export function SearchHistory({ searches, onSelect, onClear, onRemove }: SearchHistoryProps) {
  if (searches.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          Recent Searches
        </h4>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {searches.map((s) => (
          <span key={s} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted group">
            <button onClick={() => onSelect(s)} className="hover:text-primary transition-colors">
              {s}
            </button>
            <button
              onClick={() => onRemove(s)}
              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
