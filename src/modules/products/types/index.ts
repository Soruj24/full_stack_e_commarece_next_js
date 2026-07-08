export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
  keyword?: string;
  inStock?: boolean;
  onSale?: boolean;
  color?: string;
  size?: string;
  tags?: string[];
}

export interface ReviewData {
  rating: number;
  comment: string;
}

export interface QuestionData {
  question: string;
}

export interface SizeGuideData {
  category: string;
  measurements: Record<string, string[]>;
}

export type { SocialShareProps } from "./social-share";
export type { SubTabKey, CategoryTabKey, SizeGuideRow, SizeGuideTable, SizeGuideCollection } from "./size-guide";
export type { Question } from "./question";
export type { ProductDetail } from "./product-detail";
