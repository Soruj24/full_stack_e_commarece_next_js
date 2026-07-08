import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/modules/search/context/SearchContext";
import type { SearchSuggestion } from "@/modules/search/types/search-context";

export function useSearchBar(autoFocus?: boolean, onClose?: () => void) {
  const router = useRouter();
  const { query, setQuery, suggestions, isLoading, recentSearches, addRecentSearch, clearRecentSearches, performSearch } = useSearch();

  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = localQuery) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setIsOpen(false);
    onClose?.();
    performSearch();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "category" || suggestion.type === "brand") {
      setQuery(suggestion.text);
      setIsOpen(false);
      onClose?.();
      router.push(`/search?${suggestion.type}=${suggestion.slug}`);
    } else {
      handleSearch(suggestion.text);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setLocalQuery(search);
    handleSearch(search);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = [
      ...recentSearches.slice(0, 3).map((s) => ({ type: "recent" as const, text: s })),
      ...suggestions,
    ];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && allItems[selectedIndex]) handleSuggestionClick(allItems[selectedIndex]);
      else handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      onClose?.();
    }
  };

  const groupedSuggestions = {
    products: suggestions.filter((s) => s.type === "product"),
    categories: suggestions.filter((s) => s.type === "category"),
    brands: suggestions.filter((s) => s.type === "brand"),
  };

  return {
    localQuery, setLocalQuery,
    isOpen, setIsOpen,
    selectedIndex, setSelectedIndex,
    suggestions, isLoading, recentSearches, groupedSuggestions,
    inputRef, containerRef,
    handleSearch, handleSuggestionClick, handleRecentSearchClick, handleKeyDown,
    clearRecentSearches,
  };
}
