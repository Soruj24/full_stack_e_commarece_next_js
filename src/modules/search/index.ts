export { SearchProvider, useSearch } from "./context/SearchContext";
export { useSearchBar } from "./hooks/use-search-bar";
export { useSearchPage } from "./hooks/use-search-page";
export { useRecentSearches } from "./hooks/use-recent-searches";
export { fetchSuggestionsAPI, performSearchAPI } from "./services/search-service";
export type { SearchResult, SearchFilters, SearchSuggestion, SearchContextType } from "./types/search-context";
