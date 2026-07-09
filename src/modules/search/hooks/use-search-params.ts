import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function useSearchParamState() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const params = useMemo(
    () => ({
      q: sp.get("q") || "",
      category: sp.get("category") || "",
      brand: sp.get("brand") || "",
      minPrice: sp.get("minPrice") || "",
      maxPrice: sp.get("maxPrice") || "",
      rating: sp.get("rating") || "",
      inStock: sp.get("inStock") === "true",
      onSale: sp.get("onSale") === "true",
      sortBy: sp.get("sortBy") || "relevance",
      page: parseInt(sp.get("page") || "1"),
    }),
    [sp]
  );

  const updateURL = useCallback(
    (overrides: Record<string, string | undefined | boolean>) => {
      const next = new URLSearchParams();

      const q = typeof overrides.q === "string" ? overrides.q : sp.get("q") ?? "";
      const category = typeof overrides.category === "string" ? overrides.category : sp.get("category") ?? "";
      const brand = typeof overrides.brand === "string" ? overrides.brand : sp.get("brand") ?? "";
      const minPrice = typeof overrides.minPrice === "string" ? overrides.minPrice : sp.get("minPrice") ?? "";
      const maxPrice = typeof overrides.maxPrice === "string" ? overrides.maxPrice : sp.get("maxPrice") ?? "";
      const rating = typeof overrides.rating === "string" ? overrides.rating : sp.get("rating") ?? "";
      const inStock = overrides.inStock !== undefined ? overrides.inStock : sp.get("inStock") === "true";
      const onSale = overrides.onSale !== undefined ? overrides.onSale : sp.get("onSale") === "true";
      const sortBy = typeof overrides.sortBy === "string" ? overrides.sortBy : sp.get("sortBy") ?? "relevance";
      const pageVal = typeof overrides.page === "string" ? overrides.page : sp.get("page") ?? "1";

      if (q) next.set("q", q);
      if (category) next.set("category", category);
      if (brand) next.set("brand", brand);
      if (minPrice) next.set("minPrice", minPrice);
      if (maxPrice) next.set("maxPrice", maxPrice);
      if (rating) next.set("rating", rating);
      if (inStock === true) next.set("inStock", "true");
      if (onSale === true) next.set("onSale", "true");
      if (sortBy && sortBy !== "relevance") next.set("sortBy", sortBy);
      if (pageVal && pageVal !== "1") next.set("page", pageVal);

      const str = next.toString();
      router.replace(str ? `${pathname}?${str}` : pathname, { scroll: false });
    },
    [router, pathname, sp]
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      updateURL({ [key]: value || undefined, page: "1" });
    },
    [updateURL]
  );

  const removeFilter = useCallback(
    (key: string) => {
      updateURL({ [key]: undefined, page: "1" });
    },
    [updateURL]
  );

  const clearAllFilters = useCallback(() => {
    updateURL({
      category: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      inStock: undefined,
      onSale: undefined,
      page: "1",
    });
  }, [updateURL]);

  return { params, updateURL, setFilter, removeFilter, clearAllFilters };
}
