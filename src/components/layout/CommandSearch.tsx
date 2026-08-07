"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  "Wireless Headphones",
  "Smart Watch",
  "Laptop Stand",
  "Running Shoes",
  "Backpack",
];

const recentSearches = [
  "USB-C Hub",
  "Mechanical Keyboard",
  "Monitor Arm",
];

export const CommandSearch = memo(function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[70] command-overlay bg-black/40 flex items-start justify-center pt-[15vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg mx-4 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-black/[0.08] dark:border-white/[0.1] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 px-4 h-14 border-b border-border/30">
                <Search className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, brands..."
                  className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/40 outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-muted/60 text-[11px] font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  ESC
                </button>
              </div>
            </form>

            <div className="p-3 max-h-[320px] overflow-y-auto">
              {!query && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="mb-3">
                      <p className="px-2 mb-1.5 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">
                        Recent
                      </p>
                      {recentSearches.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleSearch(item)}
                          className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-accent/60 transition-colors text-left group"
                        >
                          <Clock className="w-3.5 h-3.5 text-muted-foreground/30" />
                          <span className="flex-1 text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">
                            {item}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <p className="px-2 mb-1.5 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">
                      Popular
                    </p>
                    {popularSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleSearch(item)}
                        className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-accent/60 transition-colors text-left group"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/30" />
                        <span className="flex-1 text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">
                          {item}
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {query && (
                <div className="py-8 text-center">
                  <p className="text-[13px] text-muted-foreground/40">
                    Press Enter to search for &ldquo;{query}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
