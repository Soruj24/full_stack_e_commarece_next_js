"use client";

import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { ICategory } from "@/shared/types";
import { getIcon, getGradient } from "@/lib/data/mega-menu";

interface MegaMenuFeaturedCategoriesProps {
  categories: ICategory[];
  onClose: () => void;
}

export function MegaMenuFeaturedCategories({ categories, onClose }: MegaMenuFeaturedCategoriesProps) {
  return (
    <div className="col-span-3">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Featured
        </h3>
      </div>
      <div className="space-y-2">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/products?category=${cat.slug}`}
            onClick={onClose}
            className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient(cat.icon)} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
            >
              <div className="text-white">{getIcon(cat.icon)}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm group-hover:text-primary transition-colors">
                {cat.name}
              </p>
              {cat.description && (
                <p className="text-[10px] text-muted-foreground truncate">
                  {cat.description}
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
