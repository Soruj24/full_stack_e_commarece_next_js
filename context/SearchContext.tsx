"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

export interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: { name: string; slug: string };
  brand?: string;
  rating?: number;
  numReviews?: number;
  stock: number;
  discountPrice?: number;
}

export interface SearchFilters {
  keyword: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  inStock: boolean;
  sortBy: "relevance" | "price_asc" | "price_desc" | "newest" | "rating";
}

export interface SearchSuggestion {
  type: "product" | "category" | "brand" | "recent";
  text: string;
  count?: number;
  slug?: string;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => void;
  resetFilters: () => void;
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  fetchSuggestions: (query: string) => Promise<void>;
  recentSearches: string[];
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  searchResults: SearchResult[];
  totalResults: number;
  isSearching: boolean;
  performSearch: () => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const defaultFilters: SearchFilters = {
  keyword: "",
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  rating: "",
  inStock: false,
  sortBy: "relevance",
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const MAX_RECENT_SEARCHES = 10;
const RECENT_SEARCHES_KEY = "recent-searches";

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(totalResults / 20);
  }, [totalResults]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        console.error("Failed to load recent searches");
      }
    }
  }, []);

  const addRecentSearch = useCallback((search: string) => {
    if (!search.trim()) return;
    
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (s) => s.toLowerCase() !== search.toLowerCase()
      );
      const updated = [search, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  const updateFilter = useCallback(
    (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  }, []);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (filters.category) params.set("category", filters.category);
      if (filters.brand) params.set("brand", filters.brand);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.rating) params.set("rating", filters.rating);
      if (filters.inStock) params.set("inStock", "true");
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      params.set("page", currentPage.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results || []);
        setTotalResults(data.total || 0);
        if (query) {
          addRecentSearch(query);
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, [query, filters, currentPage, addRecentSearch]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, fetchSuggestions]);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        suggestions,
        isLoading,
        fetchSuggestions,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        searchResults,
        totalResults,
        isSearching,
        performSearch,
        currentPage,
        setCurrentPage,
        totalPages,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
