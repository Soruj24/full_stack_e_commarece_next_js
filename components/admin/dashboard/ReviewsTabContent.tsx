// components/admin/dashboard/ReviewsTabContent.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Trash2,
  MessageSquare,
  ExternalLink,
  Search,
  User,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { cn } from "@/lib/utils";

export function ReviewsTabContent() {
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

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReviews = async (page = 1) => {
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
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId: string, productId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

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
        toast.error(data.error);
      }
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">
            Customer <span className="text-primary">Reviews</span>
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            Manage and moderate product reviews.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews, products, users..."
            className="pl-12 rounded-2xl h-12 bg-card border-border/50 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[32px] bg-card border border-border/50 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Total Reviews
            </p>
          </div>
          <p className="text-4xl font-black tracking-tighter">
            {pagination.total}
          </p>
        </div>
        <div className="p-8 rounded-[32px] bg-card border border-border/50 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <Star className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Average Rating
            </p>
          </div>
          <p className="text-4xl font-black tracking-tighter">
            {(
              reviews.reduce((acc, r) => acc + r.rating, 0) /
              (reviews.length || 1)
            ).toFixed(1)}
          </p>
        </div>
        <div className="p-8 rounded-[32px] bg-card border border-border/50 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Reviewed Products
            </p>
          </div>
          <p className="text-4xl font-black tracking-tighter">
            {new Set((reviews || []).map((r) => r.productId)).size}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-card border border-border/50 rounded-[48px] overflow-hidden shadow-2xl shadow-primary/5">
        <div className="p-8 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <h3 className="font-black uppercase tracking-widest text-xs">
            Recent Feedback
          </h3>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground font-medium mt-4">
              Loading reviews...
            </p>
          </div>
        ) : (filteredReviews || []).length === 0 ? (
          <div className="p-20 text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-black tracking-tight">
              No reviews found
            </h3>
            <p className="text-muted-foreground font-medium mt-1">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {(filteredReviews || []).map((review) => (
              <div
                key={review._id}
                className="p-8 hover:bg-muted/30 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
                          {review.name}
                          <span className="text-[10px] font-black text-muted-foreground/50">
                            •
                          </span>
                          <span className="text-[10px] font-black text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={cn(
                                "w-3 h-3",
                                s <= review.rating
                                  ? "fill-primary text-primary"
                                  : "fill-muted text-muted",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Package className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Product:{" "}
                          <span className="text-foreground">
                            {review.productName}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Reviewer ID:{" "}
                          <span className="text-foreground">
                            {review.user || "Guest"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-10 font-black text-[10px] uppercase tracking-widest gap-2"
                      onClick={() =>
                        window.open(`/products/${review.productId}`, "_blank")
                      }
                    >
                      <ExternalLink className="w-3 h-3" /> View Product
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-xl h-10 font-black text-[10px] uppercase tracking-widest gap-2"
                      onClick={() =>
                        handleDeleteReview(review._id, review.productId)
                      }
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="p-8 border-t border-border/50 bg-muted/10">
            <ProfessionalPagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={fetchReviews}
            />
          </div>
        )}
      </div>
    </div>
  );
}
