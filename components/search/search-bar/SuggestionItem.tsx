import { cn } from "@/lib/utils";
import type { SearchSuggestion } from "@/types/search-context";

interface SuggestionItemProps {
  suggestion: SearchSuggestion;
  icon: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}

export function SuggestionItem({ suggestion, icon, onClick, isSelected }: SuggestionItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
        isSelected ? "bg-primary/10 text-primary ring-2 ring-primary/20" : "hover:bg-muted"
      )}
    >
      <span className={cn("transition-colors", isSelected ? "text-primary" : "text-muted-foreground")}>
        {icon}
      </span>
      <span className="flex-1 text-left truncate">{suggestion.text}</span>
      {suggestion.count && (
        <span className="text-xs text-muted-foreground">{suggestion.count} items</span>
      )}
    </button>
  );
}
