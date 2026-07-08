import type { ICategory } from "@/shared/types";

interface CategoryApiResponse {
  success: boolean;
  categories?: ICategory[];
  category?: ICategory;
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

export async function fetchAllCategoriesForParent(
  excludeId?: string
): Promise<ICategory[]> {
  try {
    const res = await fetch("/api/categories?all=true&active=true");
    const data: CategoryApiResponse = await res.json();
    if (data.success && Array.isArray(data.categories)) {
      return excludeId
        ? data.categories.filter((c) => c._id !== excludeId)
        : data.categories;
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveCategory(
  data: Partial<ICategory>,
  categoryId?: string
): Promise<CategoryApiResponse> {
  const url = categoryId
    ? `/api/categories/${categoryId}`
    : "/api/categories";
  const method = categoryId ? "PATCH" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
