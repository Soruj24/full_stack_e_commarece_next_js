"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-3xl border border-border/50 p-6 space-y-6 sticky top-4">
              <Skeleton className="h-6 w-32" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <div className="space-y-2 pl-4">
                    {[1, 2].map((j) => (
                      <Skeleton key={j} className="h-3 w-20" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Skeleton className="h-5 w-48" />
                <div className="flex gap-3">
                  <Skeleton className="h-9 w-32 rounded-xl" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
                    <Skeleton className="aspect-square rounded-t-3xl" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex items-center justify-between pt-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-9 w-28 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
