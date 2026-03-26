// components/products/ProductSearch.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Loader2,
  ArrowRight,
  Package,
  Tag,
  Command,
  TrendingUp,
  History,
  X,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn, getFallbackImage } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type InteractiveItem =
  | {
      type: "filter";
      value: { label: string; icon: React.ReactNode; query: string };
    }
  | { type: "recent"; value: string }
  | { type: "popular"; value: string }
  | { type: "category"; value: { _id: string; slug: string; name: string } }
  | {
      type: "product";
      value: {
        _id: string;
        name: string;
        price: number;
        images?: string[];
        category?: { name: string };
      };
    };

export function ProductSearch() {
  const popularSearches = [
    "Tactical Gear",
    "Cybernetics",
    "Power Cells",
    "Armor Plating",
  ];

  const filterSuggestions = [
    {
      label: "Under $500",
      icon: <Tag className="w-3 h-3" />,
      query: "maxPrice=500",
    },
    {
      label: "New Arrivals",
      icon: <Package className="w-3 h-3" />,
      query: "sort=newest",
    },
    {
      label: "Top Rated",
      icon: <TrendingUp className="w-3 h-3" />,
      query: "sort=rating",
    },
    {
      label: "Cybernetics",
      icon: <Zap className="w-3 h-3" />,
      query: "category=cybernetics",
    },
  ];

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{
    categories?: { _id: string; slug: string; name: string }[];
    products?: {
      _id: string;
      name: string;
      price: number;
      images?: string[];
      category?: { name: string };
    }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Combine all interactive items for keyboard navigation
  const getInteractiveItems = () => {
    // components/products/ProductSearch.tsx
    const items: InteractiveItem[] = [];

    // Always add filter chips first
    filterSuggestions.forEach((filter) =>
      items.push({ type: "filter", value: filter }),
    );

    if (query.length < 2) {
      recentSearches.forEach((term) =>
        items.push({ type: "recent", value: term }),
      );
      popularSearches.forEach((term) =>
        items.push({ type: "popular", value: term }),
      );
    } else if (suggestions) {
      suggestions.categories?.forEach((cat) =>
        items.push({ type: "category", value: cat }),
      );
      suggestions.products?.forEach((prod) =>
        items.push({ type: "product", value: prod }),
      );
    }
    return items;
  };

  const interactiveItems = getInteractiveItems();

  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) setRecentSearches(JSON.parse(saved));

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < interactiveItems.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const item = interactiveItems[selectedIndex];
        if (item.type === "filter") {
          handleFilterClick(item.value.query);
        } else if (item.type === "recent" || item.type === "popular") {
          setQuery(item.value);
          router.push(`/products?keyword=${encodeURIComponent(item.value)}`);
          setIsOpen(false);
        } else if (item.type === "category") {
          router.push(`/products?category=${item.value.slug}`);
          setIsOpen(false);
        } else if (item.type === "product") {
          router.push(`/products/${item.value._id}`);
          setIsOpen(false);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, interactiveItems, selectedIndex, router]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions(null);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${query}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.suggestions);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query.trim());
      router.push(`/products?keyword=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleFilterClick = (filterQuery: string) => {
    router.push(`/products?${filterQuery}`);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl group z-[100]">
      <form onSubmit={handleSearch} className="relative z-[110]">
        <div className="relative flex items-center">
          <Search
            className={cn(
              "absolute left-4 w-4 h-4 transition-all duration-300",
              isOpen || query
                ? "text-primary scale-110"
                : "text-muted-foreground group-hover:text-primary",
            )}
          />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
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
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 w-full mt-3 bg-card border border-border/50 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-primary/10 overflow-hidden z-[100]"
          >
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto no-scrollbar">
              {/* Filter Chips - Always Visible */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-2 -mx-1 px-1">
                {filterSuggestions.map((filter, i) => {
                  const isSelected = selectedIndex === i;
                  return (
                    <button
                      key={i}
                      onMouseEnter={() => setSelectedIndex(i)}
                      onClick={() => handleFilterClick(filter.query)}
                      className={cn(
                        "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : "bg-muted/50 border-border/40 hover:bg-primary/10 hover:border-primary/30",
                      )}
                    >
                      {React.cloneElement(
                        filter.icon as React.ReactElement<
                          React.SVGProps<SVGSVGElement>
                        >,
                        { className: "w-2.5 h-2.5 sm:w-3 sm:h-3" },
                      )}
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {query.length < 2 ? (
                <>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between px-1 sm:px-2">
                        <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                          <History className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                          Recent Expeditions
                        </h4>
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem("recent_searches");
                          }}
                          className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
                        >
                          Clear Log
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {recentSearches.map((term, i) => {
                          const globalIndex = filterSuggestions.length + i;
                          const isSelected = selectedIndex === globalIndex;
                          return (
                            <button
                              key={i}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              onClick={() => {
                                setQuery(term);
                                router.push(
                                  `/products?keyword=${encodeURIComponent(term)}`,
                                );
                                setIsOpen(false);
                              }}
                              className={cn(
                                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border transition-all text-[10px] sm:text-xs font-bold",
                                isSelected
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-muted/50 border-border/40 hover:bg-primary/10 hover:border-primary/30",
                              )}
                            >
                              {term}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="px-1 sm:px-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                      <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                      Trending Protocols
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                      {popularSearches.map((term, i) => {
                        const globalIndex =
                          filterSuggestions.length + recentSearches.length + i;
                        const isSelected = selectedIndex === globalIndex;
                        return (
                          <button
                            key={i}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            onClick={() => {
                              setQuery(term);
                              router.push(
                                `/products?keyword=${encodeURIComponent(term)}`,
                              );
                              setIsOpen(false);
                            }}
                            className={cn(
                              "flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all text-left group",
                              isSelected
                                ? "bg-primary/10 border-primary/30"
                                : "hover:bg-primary/5 border-transparent hover:border-primary/10",
                            )}
                          >
                            <div
                              className={cn(
                                "p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-transform",
                                isSelected
                                  ? "bg-primary text-white scale-110"
                                  : "bg-primary/10 text-primary group-hover:scale-110",
                              )}
                            >
                              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </div>
                            <span
                              className={cn(
                                "font-bold text-xs sm:text-sm",
                                isSelected ? "text-primary" : "",
                              )}
                            >
                              {term}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : suggestions ? (
                <>
                  {/* Categories */}
                  {(suggestions.categories?.length ?? 0) > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="px-1 sm:px-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Sectors
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {suggestions.categories?.map((cat, i) => {
                          const globalIndex = filterSuggestions.length + i;
                          const isSelected = selectedIndex === globalIndex;
                          return (
                            <Link
                              key={cat._id}
                              href={`/products?category=${cat.slug}`}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all group/item",
                                isSelected
                                  ? "bg-primary/10"
                                  : "hover:bg-primary/5",
                              )}
                            >
                              <div className="flex items-center gap-2.5 sm:gap-3">
                                <div
                                  className={cn(
                                    "p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-colors",
                                    isSelected
                                      ? "bg-primary text-white"
                                      : "bg-primary/10 text-primary",
                                  )}
                                >
                                  <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <span
                                  className={cn(
                                    "font-bold text-xs sm:text-sm",
                                    isSelected ? "text-primary" : "",
                                  )}
                                >
                                  {cat.name}
                                </span>
                              </div>
                              <ArrowRight
                                className={cn(
                                  "w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary transition-all",
                                  isSelected
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0",
                                )}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {(suggestions.products?.length ?? 0) > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="px-1 sm:px-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Identified Assets
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {suggestions.products?.map(
                          (
                            product: {
                              _id: string;
                              name: string;
                              price: number;
                              images?: string[];
                              category?: { name: string; slug?: string };
                            },
                            i: number,
                          ) => {
                            const globalIndex =
                              filterSuggestions.length +
                              (suggestions.categories?.length || 0) +
                              i;
                            const isSelected = selectedIndex === globalIndex;
                            return (
                              <Link
                                key={product._id}
                                href={`/products/${product._id}`}
                                onMouseEnter={() =>
                                  setSelectedIndex(globalIndex)
                                }
                                onClick={() => {
                                  setIsOpen(false);
                                  saveSearch(product.name);
                                }}
                                className={cn(
                                  "flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all group/item",
                                  isSelected
                                    ? "bg-primary/10"
                                    : "hover:bg-primary/5",
                                )}
                              >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-muted overflow-hidden border border-border/50 shrink-0 relative">
                                  <img
                                    src={
                                      product.images?.[0] ||
                                      getFallbackImage(product.category?.slug)
                                    }
                                    alt=""
                                    className={cn(
                                      "object-cover w-full h-full transition-transform duration-500",
                                      isSelected
                                        ? "scale-110"
                                        : "group-hover/item:scale-110",
                                    )}
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src = getFallbackImage(
                                        product.category?.slug,
                                      );
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={cn(
                                      "font-bold text-xs sm:text-sm truncate transition-colors",
                                      isSelected
                                        ? "text-primary"
                                        : "group-hover/item:text-primary",
                                    )}
                                  >
                                    {product.name}
                                  </p>
                                  <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary">
                                      ${product.price}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] text-muted-foreground/40">
                                      •
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">
                                      {product.category?.name || "Unknown"}
                                    </span>
                                  </div>
                                </div>
                                <ArrowRight
                                  className={cn(
                                    "w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary transition-all",
                                    isSelected
                                      ? "opacity-100 translate-x-0"
                                      : "opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0",
                                  )}
                                />
                              </Link>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {suggestions.products?.length === 0 &&
                    suggestions.categories?.length === 0 && (
                      <div className="py-8 sm:py-12 text-center space-y-4 sm:space-y-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] sm:rounded-[32px] bg-muted flex items-center justify-center mx-auto relative group">
                          <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Package className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/40 relative z-10" />
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <p className="font-black uppercase tracking-tighter text-xl sm:text-2xl italic">
                            Zero Matches Detected
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] max-w-[200px] sm:max-w-[240px] mx-auto leading-relaxed">
                            Our systems could not locate any assets matching
                            your current parameters.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setQuery("")}
                          className="rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] h-10 sm:h-12 px-6 sm:px-8 border-primary/20 hover:bg-primary hover:text-white transition-all duration-500"
                        >
                          Clear Search Protocol
                        </Button>
                      </div>
                    )}
                </>
              ) : null}

              <div className="pt-4 border-t border-border/50">
                <Link
                  href={`/products?keyword=${query}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 w-full rounded-xl sm:rounded-2xl bg-primary text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                >
                  Analyze all results for &ldquo;{query || "..."}&rdquo;
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
