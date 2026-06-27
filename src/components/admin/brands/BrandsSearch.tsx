"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BrandsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BrandsSearch({ value, onChange }: BrandsSearchProps) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search brands..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 pl-12 rounded-2xl bg-muted/30 border-border/50"
      />
    </div>
  );
}