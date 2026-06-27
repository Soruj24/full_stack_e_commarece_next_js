"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InventorySearchProps {
  value: string;
  onChange: (value: string) => void;
  onExport?: () => void;
}

export function InventorySearch({ value, onChange, onExport }: InventorySearchProps) {
  return (
    <div className="p-8 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="relative flex-1 max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search by SKU or Name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 rounded-2xl h-12 bg-muted/30 border-border/50"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="rounded-xl border-border/50 font-bold gap-2"
        >
          <Filter className="w-4 h-4" /> Filter
        </Button>
        <Button
          variant="outline"
          className="rounded-xl border-border/50 font-bold"
          onClick={onExport}
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
}