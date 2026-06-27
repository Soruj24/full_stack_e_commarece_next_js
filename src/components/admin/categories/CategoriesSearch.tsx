"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CategoriesSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoriesSearch({ value, onChange }: CategoriesSearchProps) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input 
        placeholder="Search categories..." 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 h-14 rounded-2xl bg-muted/50 border-border/50 focus:bg-background transition-all"
      />
    </div>
  );
}