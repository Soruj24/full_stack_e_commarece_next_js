"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Skeleton className="h-6 w-24 mb-6" />
        
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-[500px] mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-3xl border border-border/50 p-6 space-y-6">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
