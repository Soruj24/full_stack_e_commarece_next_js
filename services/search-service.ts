import type { SearchFilters } from "@/types/search-context";

export async function fetchSuggestionsAPI(searchQuery: string) {
  const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
  return res.json();
}

export async function performSearchAPI(query: string, filters: SearchFilters, page: number) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.rating) params.set("rating", filters.rating);
  if (filters.inStock) params.set("inStock", "true");
  if (filters.sortBy !== "relevance") params.set("sortBy", filters.sortBy);
  params.set("page", page.toString());
  params.set("limit", "20");
  const res = await fetch(`/api/search?${params.toString()}`);
  return res.json();
}
