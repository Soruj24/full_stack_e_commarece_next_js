import { useState, useEffect } from "react";
import type { ICategory } from "@/shared/types";

export function useCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?active=true&sortBy=order");
        const data = await res.json();
        if (data.success && data.categories) setCategories(data.categories);
      } catch (error) { console.error("Failed to fetch categories", error); }
      finally { setLoading(false); }
    };
    fetchCategories();
  }, []);

  const featuredCategories = categories.filter((c) => c.isFeatured);
  const otherCategories = categories.filter((c) => !c.isFeatured);

  return { categories, featuredCategories, otherCategories, loading };
}
