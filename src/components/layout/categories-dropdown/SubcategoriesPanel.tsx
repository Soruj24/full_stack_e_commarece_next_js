"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ICategory } from '@/lib/types';

interface SubcategoriesPanelProps {
  activeCategory: ICategory;
  subcategories: ICategory[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export function SubcategoriesPanel({ activeCategory, subcategories, onMouseEnter, onMouseLeave, onClose }: SubcategoriesPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      className="w-[280px] bg-zinc-50/50 dark:bg-black/20 py-5 px-4 border-l border-zinc-100 dark:border-white/10"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mb-3 px-2">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{activeCategory.name}</h4>
      </div>
      <div className="space-y-[2px]">
        {subcategories.map((sub) => (
          <Link key={sub._id} href={`/products?category=${sub.slug}`} onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group">
            <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">
              {sub.name}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
