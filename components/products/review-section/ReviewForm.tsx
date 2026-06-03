"use client";

import { Star, MessageSquare } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReviewForm } from "@/hooks/use-review-form";

interface ReviewFormProps {
  productId: string;
  onReviewSubmit: () => void;
}

export function ReviewForm({ productId, onReviewSubmit }: ReviewFormProps) {
  const { rating, setRating, comment, setComment, submitting, handleSubmit } = useReviewForm(productId, onReviewSubmit);

  return (
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
          Your feedback helps us improve and helps others make better choices.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">
              Overall Rating
            </Label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)} className="transition-all duration-300 hover:scale-110 active:scale-90 group">
                  <Star
                    className={cn(
                      "w-10 h-10 transition-all duration-300",
                      s <= rating
                        ? "fill-white text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        : "text-white/20 hover:text-white/40"
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
              submitting ? "bg-white text-primary" : "bg-white text-primary hover:bg-white/90 shadow-white/10"
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
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[300px] h-[300px] bg-black/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
}
