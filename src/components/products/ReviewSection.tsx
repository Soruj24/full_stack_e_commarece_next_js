import type { Review } from "@/modules/reviews/types/review";
import { RatingSummary } from "./review-section/RatingSummary";
import { ReviewCard } from "./review-section/ReviewCard";
import { ReviewEmptyState } from "./review-section/ReviewEmptyState";
import { ReviewForm } from "./review-section/ReviewForm";

interface ReviewSectionProps {
  productId: string;
  reviews?: Review[];
  onReviewSubmit: () => void;
}

export function ReviewSection({ productId, reviews, onReviewSubmit }: ReviewSectionProps) {
  const reviewList = reviews || [];
  const total = reviewList.reduce((acc, r) => acc + r.rating, 0);
  const average = total / (reviewList.length || 1);

  const distributions = [5, 4, 3, 2, 1].map((star) => {
    const count = reviewList.filter((r) => r.rating === star).length;
    const percentage = reviewList.length > 0 ? (count / reviewList.length) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-24 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        <RatingSummary reviews={reviewList} distributions={distributions} average={average} />

        <div className="flex-1 space-y-10">
          {reviewList.length === 0 ? (
            <ReviewEmptyState />
          ) : (
            <div className="grid gap-8">
              {reviewList.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}

          <ReviewForm productId={productId} onReviewSubmit={onReviewSubmit} />
        </div>
      </div>
    </div>
  );
}
