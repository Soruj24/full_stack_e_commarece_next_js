"use client";

import { motion } from "framer-motion";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientOnly } from "@/components/common/ClientOnly";

interface ProductsPageHeaderProps {
  total: number;
  view: "grid" | "list";
  sortBy: string;
  onViewChange: (v: "grid" | "list") => void;
  onSortChange: (v: string) => void;
  onMobileFiltersToggle: () => void;
  showMobileFilters: boolean;
}

export function ProductsPageHeader({ total, view, sortBy, onViewChange, onSortChange, onMobileFiltersToggle, showMobileFilters }: ProductsPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
      <div className="space-y-2">
        <h1 className="text-5xl font-black tracking-tighter text-foreground">
          Explore Our <span className="text-primary">Products</span>
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground font-medium text-lg">Curated collection of high-quality items for your needs.</p>
          {total > 0 && (
            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{total} Items Found</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card border border-border/50 p-2 rounded-[24px] shadow-xl shadow-primary/5">
        <div className="flex p-1 bg-muted/50 rounded-2xl">
          <Button variant="ghost" size="icon" onClick={() => onViewChange("grid")}
            className={cn("rounded-xl transition-all", view === "grid" ? "bg-background shadow-md text-primary" : "text-muted-foreground")} aria-label="Grid view">
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onViewChange("list")}
            className={cn("rounded-xl transition-all", view === "list" ? "bg-background shadow-md text-primary" : "text-muted-foreground")} aria-label="List view">
            <List className="w-5 h-5" />
          </Button>
        </div>
        <Button variant="outline" onClick={onMobileFiltersToggle}
          className="lg:hidden rounded-2xl gap-2 font-bold border-border/50">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </Button>
        <div className="hidden lg:block h-8 w-px bg-border/50 mx-2" />
        <div className="hidden lg:flex items-center gap-3 px-2">
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Sorted By:</span>
          <ClientOnly>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px] h-10 rounded-xl font-bold border-border/50 bg-background/50 backdrop-blur-sm focus:ring-primary/20">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 font-medium">
                <SelectItem value="newest" className="cursor-pointer">Newest First</SelectItem>
                <SelectItem value="price-asc" className="cursor-pointer">Price: Low to High</SelectItem>
                <SelectItem value="price-desc" className="cursor-pointer">Price: High to Low</SelectItem>
                <SelectItem value="rating" className="cursor-pointer">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
