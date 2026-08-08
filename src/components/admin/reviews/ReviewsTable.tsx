"use client";

import { useState } from "react";
import { Star, ChevronUp, ChevronDown, MoreHorizontal, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Review, ReviewSortField, SortDirection } from "./useReviewsManager";
import { cn } from "@/lib/utils";

interface ReviewsTableProps {
  reviews: Review[];
  loading: boolean;
  sort: { field: ReviewSortField; direction: SortDirection };
  onSort: (field: ReviewSortField) => void;
  onDelete: (reviewId: string, productId: string) => void;
}

function SortHeader({
  label,
  field,
  currentSort,
  onSort,
}: {
  label: string;
  field: ReviewSortField;
  currentSort: { field: ReviewSortField; direction: SortDirection };
  onSort: (field: ReviewSortField) => void;
}) {
  const isActive = currentSort.field === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
    >
      {label}
      {isActive ? (currentSort.direction === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : null}
    </button>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn("h-3.5 w-3.5", star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  );
}

function ReviewRow({ review, onDelete }: { review: Review; onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <tr className="border-b border-border/60 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            {review.user?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{review.user || "Anonymous"}</p>
            <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">{review.productName}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <StarRating rating={review.rating} />
      </td>

      <td className="px-4 py-3">
        <p className="text-sm text-muted-foreground max-w-[300px] truncate">{review.comment || "—"}</p>
      </td>

      <td className="px-4 py-3">
        <span className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <a
            href={`/products/${review.productId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 w-7 inline-flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <div className="relative">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(!open)}>
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl border border-border/60 bg-card shadow-lg py-1">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                    onClick={() => { onDelete(); setOpen(false); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-border/60 animate-pulse">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted/50" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 bg-muted/50 rounded" />
                <div className="h-3 w-32 bg-muted/30 rounded" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3"><div className="flex gap-0.5">{[1,2,3,4,5].map(s => <div key={s} className="h-3.5 w-3.5 bg-muted/50 rounded" />)}</div></td>
          <td className="px-4 py-3"><div className="h-3.5 w-48 bg-muted/50 rounded" /></td>
          <td className="px-4 py-3"><div className="h-3.5 w-20 bg-muted/50 rounded" /></td>
          <td className="px-4 py-3"><div className="h-7 w-7 bg-muted/50 rounded-lg" /></td>
        </tr>
      ))}
    </>
  );
}

export function ReviewsTable({ reviews, loading, sort, onSort, onDelete }: ReviewsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card border-b border-border/60">
          <tr>
            <th className="px-4 py-3 text-left"><SortHeader label="User" field="productName" currentSort={sort} onSort={onSort} /></th>
            <th className="px-4 py-3 text-left"><SortHeader label="Rating" field="rating" currentSort={sort} onSort={onSort} /></th>
            <th className="px-4 py-3 text-left"><span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Review</span></th>
            <th className="px-4 py-3 text-left"><SortHeader label="Date" field="createdAt" currentSort={sort} onSort={onSort} /></th>
            <th className="px-4 py-3 text-right"><span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {loading ? <TableSkeleton /> : reviews.map((review) => (
            <ReviewRow key={review._id} review={review} onDelete={() => onDelete(review._id, review.productId)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
