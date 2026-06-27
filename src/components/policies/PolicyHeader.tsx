"use client";

import { Search, Printer, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PolicyHeaderProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  readingTime: number;
  onPrint: () => void;
}

export function PolicyHeader({
  title,
  description,
  icon: Icon,
  searchQuery,
  onSearchChange,
  readingTime,
  onPrint,
}: PolicyHeaderProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
            <Icon className="h-3.5 w-3.5" />
            Legal Document
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-none">
            {title}
          </h1>
          <p className="text-muted-foreground font-medium text-lg md:text-xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrint}
            className="rounded-2xl border-border hover:bg-muted transition-all"
            aria-label="Print document"
          >
            <Printer className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 border border-border text-sm font-bold text-muted-foreground">
            <Clock className="h-4 w-4" />
            {readingTime} min read
          </div>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:ring-primary transition-all text-lg font-medium"
        />
      </div>
    </div>
  );
}
