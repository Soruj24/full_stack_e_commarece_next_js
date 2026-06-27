"use client";

import { useState, useEffect, useCallback } from "react";

const MAX_RECENT_SEARCHES = 10;
const KEY = "recent-searches";

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch {
      console.error("Failed to load recent searches");
    }
  }, []);

  const addRecentSearch = useCallback((search: string) => {
    if (!search.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== search.toLowerCase());
      const updated = [search, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(KEY);
  }, []);

  return { recentSearches, addRecentSearch, clearRecentSearches };
}
