"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CategoryData } from "@/lib/data/category-grid-data";

interface CategoryCardProps {
  category: CategoryData;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
      }}
    >
      <Link href={category.href} className="block group">
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="relative overflow-hidden rounded-2xl p-4 text-center cursor-pointer border border-border/50 bg-card/80 backdrop-blur-sm hover:border-border hover:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.18)] transition-all duration-250"
        >
          <div
            className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200`}
          >
            <category.icon className="w-6 h-6 text-white" />
          </div>
          <p className="font-medium text-[13px] text-foreground leading-tight">
            {category.name}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">{category.count}</p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
