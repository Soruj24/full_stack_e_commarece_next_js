"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Info, Check, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Specification {
  label: string;
  value: string;
  highlight?: boolean;
  link?: string;
}

export interface SpecificationGroup {
  title: string;
  specifications: Specification[];
}

interface ProductSpecificationsProps {
  groups: SpecificationGroup[];
  className?: string;
}

export function ProductSpecifications({ groups, className }: ProductSpecificationsProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(groups.map((g) => g.title));

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      {groups.map((group, groupIndex) => {
        const isExpanded = expandedGroups.includes(group.title);

        return (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.05 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.title)}
              className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
            >
              <h3 className="font-semibold text-sm">{group.title}</h3>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Group Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 divide-y divide-zinc-100 dark:divide-white/5">
                    {group.specifications.map((spec, specIndex) => (
                      <div
                        key={specIndex}
                        className={cn(
                          "flex items-center justify-between py-3",
                          spec.highlight && "bg-primary/5 -mx-5 px-5 rounded-lg"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {spec.label}
                          </span>
                          {spec.highlight && (
                            <Info className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              spec.highlight ? "text-primary" : "text-foreground"
                            )}
                          >
                            {spec.value}
                          </span>
                          {spec.link && (
                            <a
                              href={spec.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

interface ComparisonTableProps {
  products: {
    id: string;
    name: string;
    image?: string;
    price: number;
    specifications: Record<string, string>;
  }[];
  specifications: string[];
  className?: string;
}

export function ComparisonTable({
  products,
  specifications,
  className,
}: ComparisonTableProps) {
  const [highlightDiffs, setHighlightDiffs] = useState(false);

  const getDiffValue = (values: string[]) => {
    const uniqueValues = [...new Set(values)];
    return uniqueValues.length === 1 ? uniqueValues[0] : null;
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid gap-4 mb-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Specifications
            </h3>
          </div>
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4"
            >
              <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
              <p className="text-lg font-bold text-primary mt-1">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Toggle Diff Highlighting */}
        <button
          onClick={() => setHighlightDiffs(!highlightDiffs)}
          className={cn(
            "mb-4 text-sm font-medium transition-colors",
            highlightDiffs ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {highlightDiffs ? "Showing differences" : "Show differences only"}
        </button>

        {/* Specifications */}
        {specifications.map((spec, index) => {
          const values = products.map((p) => p.specifications[spec] || "-");
          const diffValue = getDiffValue(values);
          const showDiff = highlightDiffs && !diffValue;

          if (showDiff) return null;

          return (
            <div
              key={spec}
              className="grid gap-4 py-3 border-b border-zinc-100 dark:border-white/5 last:border-0"
              style={{ gridTemplateColumns: `1fr repeat(${products.length}, 1fr)` }}
            >
              {/* Label */}
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">{spec}</span>
              </div>

              {/* Values */}
              {values.map((value, idx) => {
                const isDifferent = !diffValue;
                const isTrue = value.toLowerCase() === "yes" || value.toLowerCase() === "true";
                const isFalse = value.toLowerCase() === "no" || value.toLowerCase() === "false";

                return (
                  <div key={idx} className="flex items-center justify-center">
                    {isTrue ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : isFalse ? (
                      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-500" />
                      </div>
                    ) : (
                      <span
                        className={cn(
                          "text-sm font-medium text-center",
                          isDifferent && "bg-yellow-100 dark:bg-yellow-500/20 px-2 py-1 rounded"
                        )}
                      >
                        {value}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
