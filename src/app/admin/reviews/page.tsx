"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  ReviewsStats,
  ReviewsFilters,
  ReviewsTable,
  ReviewsPagination,
  ReviewsEmptyState,
  ReviewsErrorState,
  useReviewsManager,
} from "@/components/admin/reviews";

export default function ReviewsPage() {
  const {
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
    refresh,
  } = useReviewsManager();

  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    handleFilterChange("search", "");
    handleFilterChange("rating", "all");
    setResetKey((k) => k + 1);
  };

  const hasActiveFilters = !!filters.search || filters.rating !== "all";

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Manage customer reviews and ratings" />

      <ReviewsStats stats={stats} />

      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <div className="p-4">
          <ReviewsFilters
            key={resetKey}
            filters={filters}
            totalReviews={reviews.length}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {error ? (
          <ReviewsErrorState error={error} onRetry={refresh} />
        ) : !loading && reviews.length === 0 ? (
          <ReviewsEmptyState hasFilters={hasActiveFilters} onReset={handleReset} />
        ) : (
          <ReviewsTable
            reviews={reviews}
            loading={loading}
            sort={sort}
            onSort={handleSortChange}
            onDelete={handleDelete}
          />
        )}

        {!error && !loading && reviews.length > 0 && (
          <ReviewsPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
