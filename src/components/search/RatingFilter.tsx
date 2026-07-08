"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const RATINGS = [4, 3, 2, 1];

interface RatingFilterProps {
  value: number | "";
  onChange: (value: number | "") => void;
}

export function RatingFilter({ value, onChange }: RatingFilterProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
      <div className="space-y-1.5">
        <button
          onClick={() => onChange("")}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
            value === "" ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
          )}
        >
          All Ratings
        </button>
        {RATINGS.map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
              value === rating ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-muted-foreground">& up</span>
          </button>
        ))}
      </div>
    </div>
  );
}
