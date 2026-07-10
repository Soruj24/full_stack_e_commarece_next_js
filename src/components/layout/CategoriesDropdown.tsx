"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, TrendingUp, Sparkles, Zap } from "lucide-react";
import { ICategory } from "@/shared/types";
import {
  Laptop, Smartphone, Watch, Headphones,
  Camera, Gamepad2, Shirt, ShoppingBag, Gem,
  Armchair, Baby, Dumbbell, BookOpen, Paintbrush,
} from "lucide-react";

interface CategoriesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  laptop: Laptop,
  phones: Smartphone,
  watches: Watch,
  headphones: Headphones,
  camera: Camera,
  gamepad: Gamepad2,
  shirt: Shirt,
  gem: Gem,
  armchair: Armchair,
  baby: Baby,
  dumbbell: Dumbbell,
  book: BookOpen,
  paintbrush: Paintbrush,
};

const categoryGradients: Record<string, string> = {
  laptop: "from-blue-500 to-cyan-500",
  phones: "from-violet-500 to-purple-500",
  watches: "from-amber-500 to-orange-500",
  headphones: "from-emerald-500 to-teal-500",
  camera: "from-yellow-500 to-amber-500",
  gamepad: "from-indigo-500 to-blue-500",
  shirt: "from-pink-500 to-rose-500",
  gem: "from-purple-500 to-fuchsia-500",
  default: "from-primary to-primary/70",
};

const quickLinks = [
  { name: "New Arrivals", href: "/products?sort=newest", icon: Sparkles, color: "text-emerald-500 bg-emerald-500/10" },
  { name: "Best Sellers", href: "/products?sort=bestselling", icon: TrendingUp, color: "text-amber-500 bg-amber-500/10" },
  { name: "On Sale", href: "/products?sale=true", icon: Zap, color: "text-rose-500 bg-rose-500/10" },
];

export function CategoriesDropdown({ isOpen, onClose, onOpen }: CategoriesDropdownProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);
  const [subcategories, setSubcategories] = useState<ICategory[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?active=true&sortBy=order");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen, categories.length]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCategoryHover = useCallback((cat: ICategory) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(cat);
            setSubcategories(cat.children || []);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      setSubcategories([]);
    }, 150);
  }, []);

  const handlePanelMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const topLevelCategories = categories.filter((c) => c.parent == null).slice(0, 10);

  const getIcon = (iconName?: string) => {
    if (!iconName) return <ShoppingBag className="w-4 h-4" />;
    const IconComponent = iconMap[iconName] || ShoppingBag;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-[720px]"
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="mt-2 bg-white dark:bg-zinc-950 rounded-xl shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 overflow-hidden">
              <div className="flex min-h-[340px]">
                <div className="w-[260px] border-r border-black/5 dark:border-white/10 py-3 px-2 overflow-y-auto max-h-[400px]">
                  {topLevelCategories.map((cat) => {
                    const gradient = categoryGradients[cat.icon || "default"];
                    const isActive = activeCategory?._id === cat._id;
                    return (
                      <div
                        key={cat._id}
                        onMouseEnter={() => handleCategoryHover(cat)}
                      >
                        <Link
                          href={`/products?category=${cat.slug}`}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                            isActive
                              ? "bg-primary/5"
                              : "hover:bg-zinc-50 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                            <div className="text-white">{getIcon(cat.icon)}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-[13px] font-medium transition-colors block truncate ${
                              isActive ? "text-foreground" : "text-zinc-700 dark:text-zinc-300 group-hover:text-foreground"
                            }`}>
                              {cat.name}
                            </span>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 transition-all ${
                            isActive ? "text-primary opacity-100" : "text-zinc-300 opacity-0 group-hover:opacity-100"
                          }`} />
                        </Link>
                      </div>
                    );
                  })}

                  <div className="mt-2 pt-2 mx-2 border-t border-black/5 dark:border-white/10">
                    <Link
                      href="/categories"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium text-primary hover:bg-primary/5 transition-colors"
                    >
                      View all categories
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="flex-1 p-5">
                  {activeCategory && subcategories.length > 0 ? (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          {activeCategory.name}
                        </h4>
                        <div className="flex-1 h-px bg-black/5 dark:bg-white/10" />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {subcategories.map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/products?category=${sub.slug}`}
                            onClick={onClose}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group"
                          >
                            <span className="text-[13px] text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">
                              {sub.name}
                            </span>
                            <ArrowRight className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10">
                        <Link
                          href={`/products?category=${activeCategory.slug}`}
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          View all {activeCategory.name}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          Quick Access
                        </h4>
                        <div className="flex-1 h-px bg-black/5 dark:bg-white/10" />
                      </div>
                      <div className="space-y-1">
                        {quickLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group"
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${link.color}`}>
                              <link.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-foreground transition-colors block">
                                {link.name}
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                          </Link>
                        ))}
                      </div>

                      <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Featured</span>
                        </div>
                        <p className="text-[12px] text-muted-foreground leading-relaxed mb-2">
                          Discover our handpicked selection of premium products.
                        </p>
                        <Link
                          href="/products?featured=true"
                          onClick={onClose}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          Shop Featured
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
