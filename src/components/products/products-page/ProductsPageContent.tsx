"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { cn } from "@/lib/utils";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductsPageEmpty } from "./ProductsPageEmpty";
import type { IProduct } from "@/shared/types";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface ProductsPageContentProps {
  products: IProduct[];
  loading: boolean;
  view: "grid" | "list";
  pagination: { total: number; page: number; pages: number };
  currentFilters: Record<string, string>;
  onPageChange: (page: number) => void;
}

export function ProductsPageContent({ products, loading, view, pagination, currentFilters, onPageChange }: ProductsPageContentProps) {
  if (loading) {
    return (
      <div className={cn("grid gap-8", view === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
        {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    );
  }

  if (products.length === 0) return <ProductsPageEmpty />;

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        key={pagination.page + JSON.stringify(currentFilters)}
        className={cn("grid gap-8", view === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
        {products.map((product: IProduct) => (
          <motion.div key={product._id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
      <ProfessionalPagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={onPageChange} />
    </>
  );
}
