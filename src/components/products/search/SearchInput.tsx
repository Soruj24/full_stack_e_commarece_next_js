"use client";

import { Search, Loader2, Command, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
  onSearch: (e: React.FormEvent) => void;
  loading: boolean;
  isOpen: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  compact?: boolean;
}

export function SearchInput({
  value, onChange, onFocus, onClear, onSearch,
  loading, isOpen, inputRef, compact,
}: SearchInputProps) {
  return (
    <form onSubmit={onSearch} className="relative z-[110] w-full">
      <div className="relative flex items-center">
        <Search
          className={cn(
            "absolute transition-colors duration-200",
            compact
              ? "left-3 w-4 h-4 text-muted-foreground"
              : "left-4 w-[18px] h-[18px] sm:left-5",
            isOpen || value ? "text-foreground" : "",
          )}
        />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder="Search products..."
          className={cn(
            "transition-all duration-200 w-full",
            compact
              ? "pl-10 pr-9 h-10 rounded-xl bg-muted/40 border-border/30 focus:bg-background focus:border-foreground/20 text-[13px] placeholder:text-muted-foreground/50"
              : "pl-12 sm:pl-14 pr-14 sm:pr-16 h-12 sm:h-14 rounded-2xl bg-muted/50 border-border/50 focus:bg-background focus:border-foreground/20 focus:shadow-lg focus:shadow-primary/5 text-[14px] placeholder:text-muted-foreground/40",
          )}
        />
        <div className={cn(
          "absolute flex items-center gap-1.5",
          compact ? "right-2.5" : "right-3 sm:right-4",
        )}>
          {loading ? (
            <Loader2 className={cn("animate-spin text-muted-foreground", compact ? "w-4 h-4" : "w-4 h-4")} />
          ) : !compact ? (
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/80 border border-border/50 text-[10px] font-medium text-muted-foreground/60">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          ) : null}
          {value && (
            <button type="button" onClick={onClear}
              className="p-0.5 rounded-full hover:bg-muted transition-colors">
              <X className={cn("text-muted-foreground/50 hover:text-foreground transition-colors", compact ? "w-3.5 h-3.5" : "w-4 h-4")} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
