"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandFilterProps {
  brands: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function BrandFilter({ brands, selected, onChange }: BrandFilterProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => brands.filter((b) => b.toLowerCase().includes(search.toLowerCase())),
    [brands, search]
  );

  const toggle = (brand: string) => {
    if (selected.includes(brand)) {
      onChange(selected.filter((b) => b !== brand));
    } else {
      onChange([...selected, brand]);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Brand</label>
      {brands.length > 5 && (
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      )}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {filtered.map((brand) => (
          <label
            key={brand}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors",
              selected.includes(brand) ? "bg-primary/5 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Checkbox
              checked={selected.includes(brand)}
              onCheckedChange={() => toggle(brand)}
            />
            <span>{brand}</span>
          </label>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground px-2 py-1">No brands match your search</p>
        )}
      </div>
    </div>
  );
}
