"use client";

import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { ICategory } from "@/types";
import { getIcon } from "@/lib/data/mega-menu";

interface MegaMenuAllCategoriesProps {
  categories: ICategory[];
  onClose: () => void;
  hoveredCategory: string | null;
  setHoveredCategory: (id: string | null) => void;
}

export function MegaMenuAllCategories({
  categories,
  onClose,
  hoveredCategory,
  setHoveredCategory,
}: MegaMenuAllCategoriesProps) {
  return (
    <div className="col-span-4">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          All Categories
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/products?category=${cat.slug}`}
            onClick={onClose}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200"
            onMouseEnter={() => setHoveredCategory(cat._id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <span className="text-muted-foreground group-hover:text-primary transition-colors">
                {getIcon(cat.icon)}
              </span>
            </div>
            <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/categories"
        onClick={onClose}
        className="flex items-center justify-center gap-2 mt-6 p-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
      >
        <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-wider">
          View All Categories
        </span>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </Link>
    </div>
  );
}
