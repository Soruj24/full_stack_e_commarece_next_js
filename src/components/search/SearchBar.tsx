"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchBar } from "@/modules/search/hooks/use-search-bar";
import { SuggestionsDropdown } from "./search-bar/SuggestionsDropdown";

interface SearchBarProps {
  variant?: "default" | "modal" | "header";
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

export function SearchBar({ variant = "default", className, placeholder = "Search products...", autoFocus = false, onClose }: SearchBarProps) {
  const {
    localQuery, setLocalQuery, isOpen, setIsOpen, selectedIndex, setSelectedIndex,
    suggestions, isLoading, recentSearches, groupedSuggestions,
    inputRef, containerRef,
    handleSearch, handleSuggestionClick, handleRecentSearchClick, handleKeyDown, clearRecentSearches,
  } = useSearchBar(autoFocus, onClose);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
        <Input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => { setLocalQuery(e.target.value); setSelectedIndex(-1); }}
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
            onClick={() => { setLocalQuery(""); inputRef.current?.focus(); }}
            className="absolute right-14 md:right-16 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <Button onClick={() => handleSearch()} size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 md:h-10 px-3 md:px-4 rounded-lg md:rounded-xl font-semibold">
          <span className="hidden md:inline">Search</span>
          <Search className="w-4 h-4 md:hidden" />
        </Button>
      </div>

      <AnimatePresence>
        <SuggestionsDropdown
          isOpen={isOpen}
          localQuery={localQuery}
          isLoading={isLoading}
          suggestions={suggestions}
          recentSearches={recentSearches}
          selectedIndex={selectedIndex}
          groupedSuggestions={groupedSuggestions}
          onSuggestionClick={handleSuggestionClick}
          onRecentSearchClick={handleRecentSearchClick}
          onSearch={() => handleSearch()}
          onClearRecent={clearRecentSearches}
        />
      </AnimatePresence>
    </div>
  );
}

export { SearchModal } from "./search-bar/SearchModal";
