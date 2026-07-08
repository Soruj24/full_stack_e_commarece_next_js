"use client";

import { useProductSearch } from "@/modules/products/hooks/use-product-search";
import { SearchInput } from "./search/SearchInput";
import { SearchDropdown } from "./search/SearchDropdown";

export function ProductSearch() {
  const {
    query, setQuery, suggestions, loading, isOpen, setIsOpen,
    recentSearches, setRecentSearches, selectedIndex, setSelectedIndex,
    filterSuggestions, popularSearches,
    inputRef, containerRef,
    handleSearch, handleFilterClick, saveSearch,
  } = useProductSearch();

  return (
    <div ref={containerRef} className="relative w-full max-w-xl group z-[100]">
      <SearchInput
        value={query}
        onChange={setQuery}
        onFocus={() => setIsOpen(true)}
        onClear={() => setQuery("")}
        onSearch={handleSearch}
        loading={loading}
        isOpen={isOpen}
        inputRef={inputRef}
      />

      <SearchDropdown
        isOpen={isOpen}
        query={query}
        suggestions={suggestions}
        recentSearches={recentSearches}
        popularSearches={popularSearches}
        filterSuggestions={filterSuggestions}
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
        onFilterClick={handleFilterClick}
        onSuggestionClick={(term) => {
          if (term) saveSearch(term);
          setIsOpen(false);
        }}
        onClearRecent={() => {
          setRecentSearches([]);
          localStorage.removeItem("recent_searches");
        }}
        onClearQuery={() => setQuery("")}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
