import { motion } from "framer-motion";
import { Search, Package, Tag, TrendingUp, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuggestionItem } from "./SuggestionItem";
import type { SearchSuggestion } from "@/modules/search/types/search-context";

interface SuggestionsDropdownProps {
  isOpen: boolean;
  localQuery: string;
  isLoading: boolean;
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  selectedIndex: number;
  groupedSuggestions: {
    products: SearchSuggestion[];
    categories: SearchSuggestion[];
    brands: SearchSuggestion[];
  };
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  onRecentSearchClick: (search: string) => void;
  onSearch: () => void;
  onClearRecent: () => void;
}

export function SuggestionsDropdown({
  isOpen, localQuery, isLoading, suggestions, recentSearches, selectedIndex,
  groupedSuggestions, onSuggestionClick, onRecentSearchClick, onSearch, onClearRecent,
}: SuggestionsDropdownProps) {
  if (!isOpen || (localQuery.length < 2 && recentSearches.length === 0)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-xl md:rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[500px] overflow-y-auto"
    >
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && localQuery.length >= 2 && suggestions.length > 0 && (
        <div className="p-2">
          {groupedSuggestions.products.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</div>
              {groupedSuggestions.products.slice(0, 5).map((s, idx) => (
                <SuggestionItem key={`product-${idx}`} suggestion={s} icon={<Package className="w-4 h-4" />} onClick={() => onSuggestionClick(s)} isSelected={selectedIndex === idx} />
              ))}
            </div>
          )}
          {groupedSuggestions.categories.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</div>
              {groupedSuggestions.categories.map((s, idx) => (
                <SuggestionItem key={`category-${idx}`} suggestion={s} icon={<Tag className="w-4 h-4" />} onClick={() => onSuggestionClick(s)} isSelected={selectedIndex === groupedSuggestions.products.length + idx} />
              ))}
            </div>
          )}
          {groupedSuggestions.brands.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brands</div>
              {groupedSuggestions.brands.slice(0, 3).map((s, idx) => (
                <SuggestionItem key={`brand-${idx}`} suggestion={s} icon={<TrendingUp className="w-4 h-4" />} onClick={() => onSuggestionClick(s)} isSelected={selectedIndex === groupedSuggestions.products.length + groupedSuggestions.categories.length + idx} />
              ))}
            </div>
          )}
          <Button onClick={onSearch} variant="ghost" className="w-full justify-between font-semibold text-primary hover:text-primary">
            See all results for &quot;{localQuery}&quot;
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {!isLoading && localQuery.length >= 2 && suggestions.length === 0 && (
        <div className="p-6 text-center">
          <Search className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground">No results found</p>
          <p className="text-sm text-muted-foreground/70">Try different keywords</p>
        </div>
      )}

      {!isLoading && localQuery.length < 2 && recentSearches.length > 0 && (
        <div className="p-2">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              Recent Searches
            </div>
            <Button variant="ghost" size="sm" onClick={onClearRecent} className="h-auto p-1 text-xs">Clear</Button>
          </div>
          {recentSearches.slice(0, 5).map((search, idx) => (
            <button
              key={idx}
              onClick={() => onRecentSearchClick(search)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Clock className="w-4 h-4 text-muted-foreground/50" />
              <span className="flex-1 text-left">{search}</span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
