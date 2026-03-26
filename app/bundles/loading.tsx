"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
                <Skeleton className="aspect-square rounded-t-3xl" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-16 line-through" />
                  </div>
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
