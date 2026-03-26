// components/products/ReviewSection.tsx
"use client";

import { useState } from "react";
import { Star, CheckCircle2, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Review {
  _id: string;
  name?: string;
  user?: {
    name: string;
  };
  rating: number;
  comment: string;
  isVerified?: boolean;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  reviews?: Review[];
  onReviewSubmit: () => void;
}

export function ReviewSection({
  productId,
  reviews,
  onReviewSubmit,
}: ReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review submitted successfully");
        setComment("");
        setRating(5);
        onReviewSubmit();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = (reviews || []).filter((r) => r.rating === star).length;
    const percentage =
      (reviews || []).length > 0 ? (count / (reviews || []).length) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-24 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Rating Summary */}
        <div className="lg:w-1/3 space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <Star className="w-3 h-3 fill-primary" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
              Customer <span className="text-primary">Reviews</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Real feedback from real people who trust our products.
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-2xl shadow-primary/5 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-6 sm:gap-8 mb-8 sm:mb-10">
                <div className="text-center">
                  <p className="text-5xl sm:text-7xl font-black text-primary leading-none tracking-tighter mb-2">
                    {(
                      (reviews || []).reduce((acc, r) => acc + r.rating, 0) /
                      ((reviews || []).length || 1)
                    ).toFixed(1)}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-4 h-4 transition-all duration-300",
                          s <=
                            Math.round(
                              (reviews || []).reduce(
                                (acc, r) => acc + r.rating,
                                0,
                              ) / ((reviews || []).length || 1),
                            )
                            ? "fill-primary text-primary scale-110"
                            : "fill-muted text-muted",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground mt-4 opacity-60">
                    {(reviews || []).length} Reviews
                  </p>
                </div>
                <div className="h-24 w-px bg-border/40" />
                <div className="flex-1 space-y-3">
                  {ratingDistribution.map((item) => (
                    <div
                      key={item.star}
                      className="flex items-center gap-4 group/bar"
                    >
                      <span className="text-[10px] font-black w-4 text-muted-foreground group-hover/bar:text-primary transition-colors">
                        {item.star}
                      </span>
                      <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground/40 w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  const form = document.getElementById("review-form");
                  form?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full rounded-[24px] h-14 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-500"
              >
                Share Your Story
              </Button>
            </div>
            {/* Subtle background glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 space-y-10">
          {(reviews || []).length === 0 ? (
            <div className="bg-card/40 backdrop-blur-xl rounded-[64px] p-16 sm:p-24 text-center border border-dashed border-border/40 group hover:border-primary/40 transition-all duration-700 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-10">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card border border-border/40 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
                  <MessageSquare className="w-10 h-10 sm:w-16 sm:h-16 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic">
                    Zero{" "}
                    <span className="text-primary not-italic">Feedback</span>
                  </h3>
                  <p className="text-muted-foreground font-bold text-base sm:text-xl max-w-md mx-auto leading-relaxed uppercase tracking-widest">
                    Be the first operative to provide intelligence on this
                    asset. Your feedback is vital for the community.
                  </p>
                </div>
                <Button
                  onClick={() =>
                    document
                      .getElementById("review-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-full px-12 h-16 font-black text-xs uppercase tracking-[0.3em] bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-500"
                >
                  Submit Intel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
              {(reviews || []).map((review) => (
                <div
                  key={review._id}
                  className="bg-card border border-border/40 p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-xl shadow-primary/5 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] bg-primary/10 flex items-center justify-center text-primary font-black text-xl sm:text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {review.name ? review.name.charAt(0) : "?"}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-black text-base uppercase tracking-tight text-foreground">
                            {review.name}
                          </h4>
                          {review.isVerified && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 bg-muted/30 px-4 py-2 rounded-full">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "w-3.5 h-3.5",
                            s <= review.rating
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed pl-2 border-l-4 border-primary/10">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-6 pt-8 border-t border-border/40">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all duration-300 group/btn">
                      <ThumbsUp className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      Helpful{" "}
                      <span className="text-muted-foreground/40">(12)</span>
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-red-500 transition-all duration-300">
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Form */}
          <div
            id="review-form"
            className="bg-primary p-12 md:p-16 rounded-[64px] text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40"
          >
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <MessageSquare className="w-3 h-3" />
                Share Experience
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                Leave a <span className="text-white/60">Review</span>
              </h3>
              <p className="text-primary-foreground/70 font-medium text-lg mb-12">
                Your feedback helps us improve and helps others make better
                choices.
              </p>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">
                    Overall Rating
                  </Label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="transition-all duration-300 hover:scale-110 active:scale-90 group"
                      >
                        <Star
                          className={cn(
                            "w-10 h-10 transition-all duration-300",
                            s <= rating
                              ? "fill-white text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                              : "text-white/20 hover:text-white/40",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">
                    Your Thoughts
                  </Label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="What did you love about this product?"
                    className="w-full bg-white/10 border-white/20 rounded-[32px] p-8 min-h-[180px] text-white placeholder:text-white/30 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all font-medium text-lg"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className={cn(
                    "w-full rounded-[24px] h-14 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all duration-500",
                    submitting
                      ? "bg-white text-primary"
                      : "bg-white text-primary hover:bg-white/90 shadow-white/10",
                  )}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                      Transmitting...
                    </span>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </div>
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[300px] h-[300px] bg-black/10 rounded-full blur-[80px] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
