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
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    const result: (number | "...")[] = [];
    if (page <= 3) {
      result.push(1, 2, 3, 4, "...", pages);
    } else if (page >= pages - 2) {
      result.push(1, "...", pages - 3, pages - 2, pages - 1, pages);
    } else {
      result.push(1, "...", page - 1, page, page + 1, "...", pages);
    }
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
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={page <= 1}
        className="h-9 w-9 p-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {items.map((item, i) =>
        item === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">
            ...
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(item)}
            className={cn("h-9 w-9 p-0", item === page && "shadow-sm")}
          >
            {item}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={page >= pages}
        className="h-9 w-9 p-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  );
}
