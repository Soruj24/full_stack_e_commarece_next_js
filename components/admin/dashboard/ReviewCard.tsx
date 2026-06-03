"use client";

import { Star, Trash2, ExternalLink, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export function ReviewCard({ review, onDelete }: { review: Review; onDelete: (reviewId: string, productId: string) => void }) {
  return (
    <div className="p-8 hover:bg-muted/30 transition-all group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
              {review.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
                {review.name}
                <span className="text-[10px] font-black text-muted-foreground/50">•</span>
                <span className="text-[10px] font-black text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
              </h4>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted")} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">&ldquo;{review.comment}&rdquo;</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Package className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Product: <span className="text-foreground">{review.productName}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Reviewer ID: <span className="text-foreground">{review.user || "Guest"}</span></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl h-10 font-black text-[10px] uppercase tracking-widest gap-2"
            onClick={() => window.open(`/products/${review.productId}`, "_blank")}>
            <ExternalLink className="w-3 h-3" /> View Product
          </Button>
          <Button variant="destructive" size="sm" className="rounded-xl h-10 font-black text-[10px] uppercase tracking-widest gap-2"
            onClick={() => onDelete(review._id, review.productId)}>
            <Trash2 className="w-3 h-3" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
