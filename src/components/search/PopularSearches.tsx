"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

interface PopularSearchesProps {
  onSelect: (query: string) => void;
}

export function PopularSearches({ onSelect }: PopularSearchesProps) {
  const [searches, setSearches] = useState<{ query: string; count: number }[]>([]);

  useEffect(() => {
    fetch("/api/search/popular")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSearches(data.searches.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  if (searches.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <TrendingUp className="w-3 h-3" />
        Trending Searches
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {searches.map((s) => (
          <button
            key={s.query}
            onClick={() => onSelect(s.query)}
            className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
          >
            {s.query}
          </button>
        ))}
      </div>
    </div>
  );
}
