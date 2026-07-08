"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FilterChips } from "./FilterChips";
import { InitialSuggestions } from "./InitialSuggestions";
import { SearchResults } from "./SearchResults";
import { ViewAllLink } from "./ViewAllLink";

interface SearchDropdownProps {
  isOpen: boolean;
  query: string;
  suggestions: SearchSuggestions | null;
  recentSearches: string[];
  popularSearches: string[];
  filterSuggestions: { label: string; query: string }[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onFilterClick: (query: string) => void;
  onSuggestionClick: (term: string) => void;
  onClearRecent: () => void;
  onClearQuery: () => void;
  onClose: () => void;
}

import { SearchSuggestions } from "@/modules/search/types/product-search";

export function SearchDropdown({
  isOpen, query, suggestions, recentSearches, popularSearches,
  filterSuggestions, selectedIndex, onSelectIndex,
  onFilterClick, onSuggestionClick, onClearRecent, onClearQuery, onClose,
}: SearchDropdownProps) {
  const filterCount = filterSuggestions.length;
  const categoryCount = suggestions?.categories?.length ?? 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-0 w-full mt-3 bg-card border border-border/50 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-primary/10 overflow-hidden z-[100]"
        >
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto no-scrollbar">
            <FilterChips
              filters={filterSuggestions}
              selectedIndex={selectedIndex}
              offset={0}
              onSelect={onSelectIndex}
              onClick={onFilterClick}
            />

            {query.length < 2 ? (
              <InitialSuggestions
                recentSearches={recentSearches}
                popularSearches={popularSearches}
                selectedIndex={selectedIndex}
                filterCount={filterCount}
                onSelect={onSelectIndex}
                onClick={onSuggestionClick}
                onClearRecent={onClearRecent}
              />
            ) : suggestions ? (
              <SearchResults
                suggestions={suggestions}
                selectedIndex={selectedIndex}
                filterCount={filterCount}
                categoryCount={categoryCount}
                onSelect={onSelectIndex}
                onItemClick={onSuggestionClick}
                onClear={onClearQuery}
              />
            ) : null}

            <ViewAllLink query={query} onClick={onClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
