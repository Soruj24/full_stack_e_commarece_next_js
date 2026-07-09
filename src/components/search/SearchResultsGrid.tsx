"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/shared/types";

interface SearchResultsGridProps {
  results: IProduct[];
  view: "grid" | "list";
  className?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function SearchResultsGrid({ results, view, className }: SearchResultsGridProps) {
  const memoizedResults = useMemo(() => results, [results]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-4",
        className
      )}
    >
      {memoizedResults.map((product) => (
        <motion.div key={product._id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
