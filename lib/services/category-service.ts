import { ICategory } from "@/types";

interface CategoryApiResponse {
  success: boolean;
  categories?: ICategory[];
  error?: string;
}

export async function fetchActiveCategories(): Promise<ICategory[]> {
  try {
    const res = await fetch("/api/categories?active=true&sortBy=order");
    const data: CategoryApiResponse = await res.json();
    if (data.success && Array.isArray(data.categories)) {
      return data.categories;
    }
    return [];
  } catch {
    return [];
  }
}
