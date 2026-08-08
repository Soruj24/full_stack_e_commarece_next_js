"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
  productId: string;
  productName: string;
}

export type ReviewSortField = "rating" | "createdAt" | "productName";
export type SortDirection = "asc" | "desc";
export type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

export interface ReviewFilters {
  search: string;
  rating: RatingFilter;
}

export function useReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 0 });
  const [filters, setFilters] = useState<ReviewFilters>({ search: "", rating: "all" });
  const [sort, setSort] = useState<{ field: ReviewSortField; direction: SortDirection }>({
    field: "createdAt",
    direction: "desc",
  });

  const abortRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchReviews = useCallback(async (page = 1) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(pagination.limit));

      const res = await fetch(`/api/admin/reviews?${params.toString()}`, {
        signal: abortRef.current.signal,
      });
      const data = await res.json();

      if (data.success) {
        let list: Review[] = data.reviews || [];

        if (filters.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(
            (r) =>
              r.productName?.toLowerCase().includes(q) ||
              r.comment?.toLowerCase().includes(q) ||
              r.user?.toLowerCase().includes(q)
          );
        }

        if (filters.rating !== "all") {
          const ratingNum = parseInt(filters.rating);
          list = list.filter((r) => r.rating === ratingNum);
        }

        list.sort((a, b) => {
          let aVal: number | string;
          let bVal: number | string;
          switch (sort.field) {
            case "rating":
              aVal = a.rating;
              bVal = b.rating;
              break;
            case "productName":
              aVal = a.productName?.toLowerCase() || "";
              bVal = b.productName?.toLowerCase() || "";
              break;
            default:
              aVal = new Date(a.createdAt).getTime();
              bVal = new Date(b.createdAt).getTime();
          }
          if (sort.direction === "asc") return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        });

        setReviews(list);
        setPagination((prev) => ({
          ...prev,
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      } else {
        setError(data.error || "Failed to fetch reviews");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Failed to fetch reviews");
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.limit]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => fetchReviews(1), 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [filters, sort, fetchReviews]);

  const handlePageChange = useCallback((page: number) => fetchReviews(page), [fetchReviews]);

  const handleFilterChange = useCallback((key: keyof ReviewFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSortChange = useCallback((field: ReviewSortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  }, []);

  const handleDelete = useCallback(async (reviewId: string, productId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, productId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted");
        fetchReviews(pagination.page);
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete review");
    }
  }, [pagination.page, fetchReviews]);

  const stats = {
    total: pagination.total,
    avgRating: reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0",
    fiveStar: reviews.filter((r) => r.rating === 5).length,
    oneStar: reviews.filter((r) => r.rating === 1).length,
  };

  return {
    reviews,
    loading,
    error,
    pagination,
    filters,
    sort,
    stats,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    handleDelete,
    refresh: () => fetchReviews(pagination.page),
  };
}
