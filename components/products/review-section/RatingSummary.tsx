import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Review, RatingDistribution } from "@/features/reviews/types/review";

interface RatingSummaryProps {
  reviews: Review[];
  distributions: RatingDistribution[];
  average: number;
}

export function RatingSummary({ reviews, distributions, average }: RatingSummaryProps) {
  return (
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
                {average.toFixed(1)}
              </p>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "w-4 h-4 transition-all duration-300",
                      s <= Math.round(average)
                        ? "fill-primary text-primary scale-110"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground mt-4 opacity-60">
                {reviews.length} Reviews
              </p>
            </div>
            <div className="h-24 w-px bg-border/40" />
            <div className="flex-1 space-y-3">
              {distributions.map((item) => (
                <div key={item.star} className="flex items-center gap-4 group/bar">
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
            onClick={() => document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full rounded-[24px] h-14 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-500"
          >
            Share Your Story
          </Button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
      </div>
    </div>
  );
}
