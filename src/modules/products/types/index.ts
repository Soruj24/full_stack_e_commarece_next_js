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
