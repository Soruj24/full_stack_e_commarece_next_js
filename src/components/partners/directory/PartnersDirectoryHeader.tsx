"use client";

import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  total: number;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function PartnersDirectoryHeader({ total, showFilters, onToggleFilters }: Props) {
  return (
    <header className="border-b bg-card/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/partners">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Partner Directory</h1>
              <p className="text-sm text-muted-foreground">{total} partners</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 md:hidden" onClick={onToggleFilters}>
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
      </div>
    </header>
  );
}
