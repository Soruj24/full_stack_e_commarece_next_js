"use client";

import { Star, MessageSquare, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { useReviewsTab } from "@/features/products/hooks/use-reviews-tab";
import { ReviewCard } from "./ReviewCard";

export function ReviewsTabContent() {
  const { reviews, loading, pagination, searchQuery, setSearchQuery, filteredReviews, handleDeleteReview, fetchReviews } = useReviewsTab();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Customer <span className="text-primary">Reviews</span></h2>
          <p className="text-muted-foreground font-medium mt-1">Manage and moderate product reviews.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search reviews, products, users..." className="pl-12 rounded-2xl h-12 bg-card border-border/50 font-medium"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<MessageSquare className="w-6 h-6" />} label="Total Reviews" value={pagination.total} />
        <StatCard icon={<Star className="w-6 h-6" />} label="Average Rating"
          value={(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
          bg="bg-yellow-500/10" textColor="text-yellow-500" />
        <StatCard icon={<Package className="w-6 h-6" />} label="Reviewed Products"
          value={new Set((reviews || []).map((r) => r.productId)).size}
          bg="bg-green-500/10" textColor="text-green-500" />
      </div>

      <div className="bg-card border border-border/50 rounded-[48px] overflow-hidden shadow-2xl shadow-primary/5">
        <div className="p-8 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <h3 className="font-black uppercase tracking-widest text-xs">Recent Feedback</h3>
        </div>
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground font-medium mt-4">Loading reviews...</p>
          </div>
        ) : (filteredReviews || []).length === 0 ? (
          <div className="p-20 text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-black tracking-tight">No reviews found</h3>
            <p className="text-muted-foreground font-medium mt-1">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {(filteredReviews || []).map((review) => (
              <ReviewCard key={review._id} review={review} onDelete={handleDeleteReview} />
            ))}
          </div>
        )}
        {pagination.pages > 1 && (
          <div className="p-8 border-t border-border/50 bg-muted/10">
            <ProfessionalPagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={fetchReviews} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg, textColor }: { icon: React.ReactNode; label: string; value: string | number; bg?: string; textColor?: string }) {
  return (
    <div className="p-8 rounded-[32px] bg-card border border-border/50 shadow-xl shadow-primary/5">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg || "bg-primary/10"} flex items-center justify-center ${textColor || "text-primary"}`}>{icon}</div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
}
