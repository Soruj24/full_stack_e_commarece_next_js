import { SearchSuggestions } from "@/features/search/types/product-search";

interface SearchResponse {
  success: boolean;
  suggestions?: SearchSuggestions;
}

export async function fetchSearchSuggestions(query: string): Promise<SearchSuggestions | null> {
  try {
    const res = await fetch(`/api/products/search?q=${query}`);
    const data: SearchResponse = await res.json();
    if (data.success && data.suggestions) {
      return data.suggestions;
    }
    return null;
  } catch {
    return null;
  }
}
