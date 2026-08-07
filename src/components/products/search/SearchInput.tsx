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
            "absolute transition-colors duration-150",
            compact
              ? "left-3 w-3.5 h-3.5 text-muted-foreground"
              : "left-4 w-4 h-4 text-muted-foreground",
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
            "transition-all duration-150 w-full",
            compact
              ? "pl-9 pr-8 h-9 rounded-lg bg-accent/50 border-border/40 focus:bg-background focus:border-primary/30 text-[13px] placeholder:text-muted-foreground/50"
              : "pl-11 pr-14 h-11 rounded-xl bg-accent/50 border-border/40 focus:bg-background focus:border-primary/30 text-[13px] placeholder:text-muted-foreground/50",
          )}
        />
        <div className={cn(
          "absolute flex items-center gap-1.5",
          compact ? "right-2" : "right-3",
        )}>
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
          ) : !compact ? (
            <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent border border-border/40 text-[10px] font-medium text-muted-foreground/50">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          ) : null}
          {value && (
            <button type="button" onClick={onClear}
              className="p-0.5 rounded hover:bg-accent transition-colors">
              <X className={cn("text-muted-foreground/40 hover:text-foreground transition-colors", compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
