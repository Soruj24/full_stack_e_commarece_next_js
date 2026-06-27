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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
      }}
    >
      <Link href={category.href} className="block group">
        <motion.div
          whileHover={{ y: -8, rotateX: 5, rotateY: 5, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative overflow-hidden rounded-2xl p-5 text-center cursor-pointer"
          style={{
            background: category.bg,
            border: "1px solid rgba(255,255,255,0.06)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)" }}
          />
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ boxShadow: `inset 0 0 30px ${category.glow}` }}
          />
          <div
            className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
            style={{ boxShadow: `0 8px 25px ${category.glow}` }}
          >
            <category.icon className="w-7 h-7 text-white" />
          </div>
          <p className="font-bold text-sm text-foreground group-hover:text-white transition-colors leading-tight">
            {category.name}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">{category.count}</p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
