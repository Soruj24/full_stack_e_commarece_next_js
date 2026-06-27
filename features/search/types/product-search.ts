import type { ReactNode } from "react";

export interface SearchCategory {
  _id: string;
  slug: string;
  name: string;
}

export interface SearchProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: { name: string; slug?: string };
}

export interface SearchSuggestions {
  categories?: SearchCategory[];
  products?: SearchProduct[];
}

export interface FilterChip {
  label: string;
  icon: ReactNode;
  query: string;
}

export type InteractiveItem =
  | { type: "filter"; value: Omit<FilterChip, "icon"> }
  | { type: "recent"; value: string }
  | { type: "popular"; value: string }
  | { type: "category"; value: SearchCategory }
  | { type: "product"; value: SearchProduct };
