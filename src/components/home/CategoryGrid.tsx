"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "./CategoryCard";
import { categories } from "@/lib/data/category-grid-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export function CategoryGrid() {
  return (
    <div className="py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
      >
        <div>
          <p className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-3">
            Browse
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Explore our wide range of premium products
          </p>
        </div>
        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3"
      >
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </motion.div>

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          View All Categories
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
