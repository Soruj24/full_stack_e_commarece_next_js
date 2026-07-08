export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  views: number;
}

export const FAQ_CATEGORIES = [
  "Getting Started", "Orders & Shipping", "Payments",
  "Returns", "Account", "Products", "General",
] as const;
