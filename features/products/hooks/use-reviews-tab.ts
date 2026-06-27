"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface Review {
  _id: string;
  productId: string;
  productName: string;
  user?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function useReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReviews = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?page=${page}&limit=10`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setPagination(data.pagination);
      }
    } catch {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDeleteReview = async (reviewId: string, productId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, productId }),
      });
      const data = await res.json();
      if (data.success) { toast.success("Review deleted"); fetchReviews(pagination.page); }
      else toast.error(data.error);
    } catch {
      toast.error("Error deleting review");
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return { reviews, loading, pagination, searchQuery, setSearchQuery, filteredReviews, handleDeleteReview, fetchReviews };
}
