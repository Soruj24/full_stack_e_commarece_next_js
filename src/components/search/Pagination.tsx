"use client";

import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export function SearchPagination({ page, pages, onPageChange }: PaginationProps) {
  const items = useMemo(() => {
    if (pages <= 1) return [];
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    const result: (number | "ellipsis-start" | "ellipsis-end")[] = [];
    result.push(1);
    if (page > 3) result.push("ellipsis-start");
    const start = Math.max(2, page - 1);
    const end = Math.min(pages - 1, page + 1);
    for (let i = start; i <= end; i++) result.push(i);
    if (page < pages - 2) result.push("ellipsis-end");
    result.push(pages);
    return result;
  }, [page, pages]);

  const handlePrev = useCallback(() => {
    if (page > 1) onPageChange(page - 1);
  }, [page, onPageChange]);

  const handleNext = useCallback(() => {
    if (page < pages) onPageChange(page + 1);
  }, [page, pages, onPageChange]);

  if (pages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Search results pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={page <= 1}
        className="h-9 w-9 p-0"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {items.map((item) => {
        if (item === "ellipsis-start" || item === "ellipsis-end") {
          return (
            <span key={item} className="px-2 text-muted-foreground text-sm select-none" aria-hidden="true">
              &hellip;
            </span>
          );
        }
        return (
          <Button
            key={item}
            variant={item === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(item)}
            className={cn("h-9 w-9 p-0", item === page && "shadow-sm")}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </Button>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={page >= pages}
        className="h-9 w-9 p-0"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  );
}
