"use client";

import { Search, Filter, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categories, partnerTiers, getTierColor } from "@/lib/data/partners-directory";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  selectedTier: string | null;
  onTierChange: (id: string | null) => void;
  show: boolean;
}

export function PartnerSidebar({ searchQuery, onSearchChange, selectedCategory, onCategoryChange, selectedTier, onTierChange, show }: Props) {
  return (
    <aside className={cn("lg:w-72 shrink-0", show ? "block" : "hidden lg:block")}>
      <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search partners..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Categories</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => onCategoryChange(cat.id)}
              className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                selectedCategory === cat.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted")}>
              <span>{cat.name}</span>
              <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <h3 className="font-bold mb-4">Partner Tier</h3>
        <div className="space-y-2">
          <button onClick={() => onTierChange(null)}
            className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              !selectedTier ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted")}>
            <span>All Tiers</span>
          </button>
          {partnerTiers.map((tier) => (
            <button key={tier.id} onClick={() => onTierChange(tier.id)}
              className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                selectedTier === tier.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted")}>
              <span className={cn("px-2 py-0.5 rounded text-xs font-bold", getTierColor(tier.id))}>{tier.name}</span>
              <div className="flex gap-0.5">
                {[...Array(tier.stars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
