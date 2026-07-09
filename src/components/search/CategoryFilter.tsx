"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Array<{ _id: string; name: string; slug: string }>;
  selected: string;
  onChange: (slug: string) => void;
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Category</label>
      <div className="space-y-1">
        <button
          onClick={() => onChange("")}
          className={cn(
            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
            !selected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
          )}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onChange(cat.slug)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              selected === cat.slug ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
