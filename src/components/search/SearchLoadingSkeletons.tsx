"use client";

import { motion } from "framer-motion";

export function SearchLoadingSkeletons({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card rounded-3xl overflow-hidden border"
        >
          <div className="aspect-square bg-muted relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="p-5 space-y-3">
            <div className="h-4 w-1/4 bg-muted rounded-full relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
            <div className="h-6 w-3/4 bg-muted rounded-full relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
            <div className="h-4 w-1/2 bg-muted rounded-full relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
