import { Star, CheckCircle2, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/modules/reviews/types/review";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const displayName = review.name || review.user?.name || "Anonymous";
  const initial = displayName.charAt(0);

  return (
    <div className="bg-card border border-border/40 p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-xl shadow-primary/5 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] bg-primary/10 flex items-center justify-center text-primary font-black text-xl sm:text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-black text-base uppercase tracking-tight text-foreground">{displayName}</h4>
              {review.isVerified && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </div>
              )}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-1 bg-muted/30 px-4 py-2 rounded-full">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={cn("w-3.5 h-3.5", s <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted")}
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
          Helpful <span className="text-muted-foreground/40">(12)</span>
        </button>
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-red-500 transition-all duration-300">
          Report
        </button>
      </div>
    </div>
  );
}
