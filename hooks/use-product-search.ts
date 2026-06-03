"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchSearchSuggestions } from "@/lib/services/search-service";
import { SearchSuggestions, InteractiveItem } from "@/types/product-search";

const RECENT_KEY = "recent_searches";
const MAX_RECENT = 5;

const popularSearches = [
  "Tactical Gear", "Cybernetics", "Power Cells", "Armor Plating",
];

const filterSuggestions = [
  { label: "Under $500", query: "maxPrice=500" },
  { label: "New Arrivals", query: "sort=newest" },
  { label: "Top Rated", query: "sort=rating" },
  { label: "Cybernetics", query: "category=cybernetics" },
];

export function useProductSearch() {
  const [query, setQueryState] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setSelectedIndex(-1);
  }, []);

  const getInteractiveItems = useCallback((): InteractiveItem[] => {
    const items: InteractiveItem[] = [];
    filterSuggestions.forEach((f) => items.push({ type: "filter", value: f }));
    if (query.length < 2) {
      recentSearches.forEach((t) => items.push({ type: "recent", value: t }));
      popularSearches.forEach((t) => items.push({ type: "popular", value: t }));
    } else if (suggestions) {
      suggestions.categories?.forEach((c) => items.push({ type: "category", value: c }));
      suggestions.products?.forEach((p) => items.push({ type: "product", value: p }));
    }
    return items;
  }, [query, recentSearches, suggestions]);

  const interactiveItems = getInteractiveItems();

  const saveSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleFilterClick = useCallback((filterQuery: string) => {
    router.push(`/products?${filterQuery}`);
    setIsOpen(false);
  }, [router]);

  const executeItem = useCallback((item: InteractiveItem) => {
    if (item.type === "filter") handleFilterClick(item.value.query);
    else if (item.type === "recent" || item.type === "popular") {
      router.push(`/products?keyword=${encodeURIComponent(item.value)}`);
      setIsOpen(false);
    } else if (item.type === "category") {
      router.push(`/products?category=${item.value.slug}`);
      setIsOpen(false);
    } else if (item.type === "product") {
      saveSearch(item.value.name);
      router.push(`/products/${item.value._id}`);
      setIsOpen(false);
    }
  }, [router, handleFilterClick, saveSearch]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query.trim());
      router.push(`/products?keyword=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  }, [query, router, saveSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (!isOpen) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((p) => Math.min(p + 1, interactiveItems.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((p) => Math.max(p - 1, -1)); }
      else if (e.key === "Enter" && selectedIndex >= 0) { e.preventDefault(); executeItem(interactiveItems[selectedIndex]); }
      else if (e.key === "Escape") { setIsOpen(false); inputRef.current?.blur(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, interactiveItems, selectedIndex, executeItem]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await fetchSearchSuggestions(query);
      if (!cancelled) {
        if (data) setSuggestions(data);
        setIsOpen(true);
        setLoading(false);
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  return {
    query, setQuery, suggestions, loading, isOpen, setIsOpen,
    recentSearches, setRecentSearches, selectedIndex, setSelectedIndex,
    filterSuggestions, popularSearches,
    inputRef, containerRef,
    handleSearch, handleFilterClick, saveSearch,
  };
}
