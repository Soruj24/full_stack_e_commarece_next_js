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

export interface SearchContextType {
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

export const defaultFilters: SearchFilters = {
  keyword: "",
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  rating: "",
  inStock: false,
  sortBy: "relevance",
};
