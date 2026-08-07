import type { ICategory } from "@/shared/types";
import { csrfFetch } from "@/lib/security/csrf-client";

interface CategoryApiResponse {
  success: boolean;
  categories?: ICategory[];
  category?: ICategory;
  error?: string;
}

export async function fetchActiveCategories(): Promise<ICategory[]> {
  try {
    const res = await fetch("/api/categories?active=true&sortBy=order");
    if (!res.ok) return [];
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
    if (!res.ok) return [];
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

  const res = await csrfFetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    return { success: false, error: err.error || `HTTP ${res.status}` };
  }
  return res.json();
}
