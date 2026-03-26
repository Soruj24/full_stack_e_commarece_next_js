"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";

interface SearchResultsGridProps {
  results: any[];
  view: "grid" | "list";
  className?: string;
}

export function SearchResultsGrid({ results, view, className }: SearchResultsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-4",
        className
      )}
    >
      {results.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </motion.div>
  );
}
