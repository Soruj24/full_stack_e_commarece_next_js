"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Package,
  Tag,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearch, SearchSuggestion } from "@/context/SearchContext";

interface SearchBarProps {
  variant?: "default" | "modal" | "header";
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

export function SearchBar({
  variant = "default",
  className,
  placeholder = "Search products...",
  autoFocus = false,
  onClose,
}: SearchBarProps) {
  const router = useRouter();
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    performSearch,
  } = useSearch();

  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = localQuery) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    setIsOpen(false);
    if (onClose) onClose();
    performSearch();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "category" || suggestion.type === "brand") {
      setQuery(suggestion.text);
      setIsOpen(false);
      if (onClose) onClose();
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
      if (selectedIndex >= 0 && allItems[selectedIndex]) {
        handleSuggestionClick(allItems[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  const groupedSuggestions = {
    products: suggestions.filter((s) => s.type === "product"),
    categories: suggestions.filter((s) => s.type === "category"),
    brands: suggestions.filter((s) => s.type === "brand"),
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
        <Input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pl-12 pr-20 h-12 md:h-14 text-base rounded-xl md:rounded-2xl border-2 focus:border-primary transition-all w-full",
            variant === "modal" && "h-14 text-lg rounded-2xl"
          )}
        />
        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery("");
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-14 md:right-16 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <Button
          onClick={() => handleSearch()}
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 md:h-10 px-3 md:px-4 rounded-lg md:rounded-xl font-semibold"
        >
          <span className="hidden md:inline">Search</span>
          <Search className="w-4 h-4 md:hidden" />
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (localQuery.length >= 2 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-xl md:rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[500px] overflow-y-auto"
          >
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}

            {!isLoading && localQuery.length >= 2 && suggestions.length > 0 && (
              <div className="p-2">
                {groupedSuggestions.products.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Products
                    </div>
                    {groupedSuggestions.products.slice(0, 5).map((suggestion, idx) => (
                      <SuggestionItem
                        key={`product-${idx}`}
                        suggestion={suggestion}
                        icon={<Package className="w-4 h-4" />}
                        onClick={() => handleSuggestionClick(suggestion)}
                        isSelected={selectedIndex === idx}
                      />
                    ))}
                  </div>
                )}

                {groupedSuggestions.categories.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </div>
                    {groupedSuggestions.categories.map((suggestion, idx) => (
                      <SuggestionItem
                        key={`category-${idx}`}
                        suggestion={suggestion}
                        icon={<Tag className="w-4 h-4" />}
                        onClick={() => handleSuggestionClick(suggestion)}
                        isSelected={selectedIndex === groupedSuggestions.products.length + idx}
                      />
                    ))}
                  </div>
                )}

                {groupedSuggestions.brands.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Brands
                    </div>
                    {groupedSuggestions.brands.slice(0, 3).map((suggestion, idx) => (
                      <SuggestionItem
                        key={`brand-${idx}`}
                        suggestion={suggestion}
                        icon={<TrendingUp className="w-4 h-4" />}
                        onClick={() => handleSuggestionClick(suggestion)}
                        isSelected={
                          selectedIndex ===
                          groupedSuggestions.products.length +
                            groupedSuggestions.categories.length +
                            idx
                        }
                      />
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => handleSearch()}
                  variant="ghost"
                  className="w-full justify-between font-semibold text-primary hover:text-primary"
                >
                  See all results for &quot;{localQuery}&quot;
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {!isLoading && localQuery.length >= 2 && suggestions.length === 0 && (
              <div className="p-6 text-center">
                <Search className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground/70">
                  Try different keywords
                </p>
              </div>
            )}

            {!isLoading && localQuery.length < 2 && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="h-auto p-1 text-xs"
                  >
                    Clear
                  </Button>
                </div>
                {recentSearches.slice(0, 5).map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground/50" />
                    <span className="flex-1 text-left">{search}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuggestionItem({
  suggestion,
  icon,
  onClick,
  isSelected,
}: {
  suggestion: SearchSuggestion;
  icon: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
        isSelected 
          ? "bg-primary/10 text-primary ring-2 ring-primary/20" 
          : "hover:bg-muted"
      )}
    >
      <span className={cn(
        "transition-colors",
        isSelected ? "text-primary" : "text-muted-foreground"
      )}>
        {icon}
      </span>
      <span className="flex-1 text-left truncate">{suggestion.text}</span>
      {suggestion.count && (
        <span className="text-xs text-muted-foreground">
          {suggestion.count} items
        </span>
      )}
    </button>
  );
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <SearchBar variant="modal" autoFocus onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
