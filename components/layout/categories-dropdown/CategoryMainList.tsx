"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { ICategory } from "@/types";

interface CategoryMainListProps {
  categories: ICategory[];
  activeCategory: ICategory | null;
  subcategories: ICategory[];
  getIcon: (iconName?: string) => React.ReactNode;
  onMouseEnter: (cat: ICategory) => void;
  onClose: () => void;
}

export function CategoryMainList({ categories, activeCategory, subcategories, getIcon, onMouseEnter, onClose }: CategoryMainListProps) {
  return (
    <div className="flex-1 py-5 px-4">
      <div className="space-y-[2px]">
        {categories.slice(0, 8).map((cat) => (
          <div key={cat._id} className="relative" onMouseEnter={() => onMouseEnter(cat)}>
            <Link
              href={`/products?category=${cat.slug}`}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeCategory?._id === cat._id
                  ? "bg-zinc-100 dark:bg-white/10"
                  : "hover:bg-zinc-50 dark:hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  activeCategory?._id === cat._id
                    ? "bg-primary text-white"
                    : "bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary"
                }`}>
                  {getIcon(cat.icon)}
                </div>
                <span className={`font-medium text-sm transition-colors ${
                  activeCategory?._id === cat._id
                    ? "text-foreground"
                    : "text-zinc-700 dark:text-zinc-300 group-hover:text-foreground"
                }`}>
                  {cat.name}
                </span>
              </div>
              {subcategories.length > 0 && (
                <ChevronRight className={`w-4 h-4 transition-all ${
                  activeCategory?._id === cat._id
                    ? "text-primary opacity-100"
                    : "text-zinc-300 opacity-0 group-hover:opacity-100"
                }`} />
              )}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 px-4 border-t border-zinc-100 dark:border-white/10">
        <Link href="/categories" onClick={onClose}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
          View all categories
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
