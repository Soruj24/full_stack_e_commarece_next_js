"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultsToolbarProps {
  query: string;
  totalResults: number;
  loading: boolean;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
}

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function SearchResultsToolbar({
  query,
  totalResults,
  loading,
  view,
  onViewChange,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
  hasActiveFilters,
}: SearchResultsToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="md:hidden"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>
        <ResultsCount
          loading={loading}
          totalResults={totalResults}
          query={query}
        />
      </div>

      <div className="flex items-center gap-2">
        <ViewToggle view={view} onViewChange={onViewChange} />
        <SortSelect value={sortBy} onChange={onSortChange} />
      </div>
    </div>
  );
}

function ResultsCount({
  loading,
  totalResults,
  query,
}: {
  loading: boolean;
  totalResults: number;
  query: string;
}) {
  return (
    <p className="text-muted-foreground">
      {loading ? (
        "Searching..."
      ) : (
        <>
          <span className="font-semibold text-foreground">{totalResults}</span>{" "}
          results
          {query && <span className="ml-1">for &quot;{query}&quot;</span>}
        </>
      )}
    </p>
  );
}

function ViewToggle({
  view,
  onViewChange,
}: {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}) {
  return (
    <div className="hidden sm:flex border rounded-lg overflow-hidden">
      <button
        onClick={() => onViewChange("grid")}
        className={cn(
          "p-2 transition-colors",
          view === "grid" ? "bg-primary text-white" : "hover:bg-muted"
        )}
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={cn(
          "p-2 transition-colors",
          view === "list" ? "bg-primary text-white" : "hover:bg-muted"
        )}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
