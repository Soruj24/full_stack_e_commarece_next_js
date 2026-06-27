"use client";

import { motion } from "framer-motion";

export function ProductCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-[32px] border border-border/50 overflow-hidden"
    >
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
          <div className="h-10 w-10 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          <div className="h-12 bg-muted rounded-xl animate-pulse w-64" />
          <div className="h-6 bg-muted rounded animate-pulse w-96" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-card rounded-3xl animate-pulse" />
            ))}
          </div>
          
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
