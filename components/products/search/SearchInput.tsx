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
}

export function SearchInput({
  value, onChange, onFocus, onClear, onSearch,
  loading, isOpen, inputRef,
}: SearchInputProps) {
  return (
    <form onSubmit={onSearch} className="relative z-[110]">
      <div className="relative flex items-center">
        <Search
          className={cn(
            "absolute left-4 w-4 h-4 transition-all duration-300",
            isOpen || value
              ? "text-primary scale-110"
              : "text-muted-foreground group-hover:text-primary",
          )}
        />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder="Search assets or protocols..."
          className="pl-10 sm:pl-12 pr-12 sm:pr-16 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-muted/50 border-border/50 focus:bg-background focus:ring-primary/20 transition-all shadow-lg shadow-transparent focus:shadow-primary/10 text-sm sm:text-base"
        />
        <div className="absolute right-3 sm:right-4 flex items-center gap-1.5 sm:gap-2">
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-primary" />
          ) : (
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-muted border border-border/50 text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
