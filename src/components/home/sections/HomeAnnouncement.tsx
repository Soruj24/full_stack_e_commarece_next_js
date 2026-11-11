"use client";

import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { dismissAnnouncement } from "@/store/slices/homeSlice";
import { Button } from "@/components/ui/button";

export function HomeAnnouncement() {
  const dispatch = useAppDispatch();
  const dismissed = useAppSelector((s) => s.home.announcementDismissed);
  if (dismissed) return null;

  return (
    <div className="relative z-40 border-b border-border/50 bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3 text-center">
        <Sparkles className="h-4 w-4 shrink-0 opacity-90" aria-hidden="true" />
        <p className="text-xs sm:text-sm font-medium tracking-tight">
          New season edit now live — complimentary shipping on orders over $50.
          <Link href="/products?sort=newest" className="ml-2 underline underline-offset-4 decoration-white/40 hover:decoration-white">
            Shop new arrivals
          </Link>
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-2 sm:right-4 text-background hover:bg-white/10 hover:text-background"
          onClick={() => dispatch(dismissAnnouncement())}
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
