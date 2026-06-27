"use client";

import {
  createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode,
} from "react";
import { useRecentSearches } from "@/features/search/hooks/use-recent-searches";
import { fetchSuggestionsAPI, performSearchAPI } from "@/features/search/services/search-service";
import type { SearchResult, SearchFilters, SearchSuggestion, SearchContextType } from "@/features/search/types/search-context";
import { defaultFilters } from "@/features/search/types/search-context";

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  const totalPages = useMemo(() => Math.ceil(totalResults / 20), [totalResults]);

  const updateFilter = useCallback(
    (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    }, []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  }, []);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) { setSuggestions([]); return; }
    setIsLoading(true);
    try {
      const data = await fetchSuggestionsAPI(searchQuery);
      if (data.success && data.suggestions) setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      const data = await performSearchAPI(query, filters, currentPage);
      if (data.success) {
        setSearchResults(data.results || []);
        setTotalResults(data.total || 0);
        if (query) addRecentSearch(query);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, [query, filters, currentPage, addRecentSearch]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) fetchSuggestions(query);
      else setSuggestions([]);
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, fetchSuggestions]);

  return (
    <SearchContext.Provider value={{
      query, setQuery, filters, setFilters, updateFilter, resetFilters,
      suggestions, isLoading, fetchSuggestions,
      recentSearches, addRecentSearch, clearRecentSearches,
      searchResults, totalResults, isSearching, performSearch,
      currentPage, setCurrentPage, totalPages,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) throw new Error("useSearch must be used within a SearchProvider");
  return context;
}