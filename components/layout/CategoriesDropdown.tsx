"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Search,
  ArrowRight,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  Shirt,
  Home,
  Gift,
  Book,
  Car,
  UtensilsCrossed,
  WatchIcon,
  Grid3X3,
  ChevronRight,
} from "lucide-react";
import { ICategory } from "@/types";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  laptop: <Laptop className="w-4 h-4" />,
  phones: <Smartphone className="w-4 h-4" />,
  watches: <Watch className="w-4 h-4" />,
  headphones: <Headphones className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
  gamepad: <Gamepad2 className="w-4 h-4" />,
  shirt: <Shirt className="w-4 h-4" />,
  home: <Home className="w-4 h-4" />,
  gift: <Gift className="w-4 h-4" />,
  book: <Book className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
  utensils: <UtensilsCrossed className="w-4 h-4" />,
  watch: <WatchIcon className="w-4 h-4" />,
  default: <Grid3X3 className="w-4 h-4" />,
};

interface CategoriesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoriesDropdown({ isOpen, onClose }: CategoriesDropdownProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const getIcon = (iconName?: string) => {
    return iconName ? CATEGORY_ICONS[iconName] || CATEGORY_ICONS.default : CATEGORY_ICONS.default;
  };

  const getCategoryChildren = (categoryId: string) => {
    return categories.filter((c) => {
      const parent = c.parent;
      if (typeof parent === "object" && parent !== null) {
        return (parent as ICategory)._id === categoryId;
      }
      return parent === categoryId;
    });
  };

  const topLevelCategories = categories.filter((c) => !c.parent || (typeof c.parent === "string" && !c.parent));
  const subcategories = activeCategory ? getCategoryChildren(activeCategory._id) : [];

  const handleMouseEnter = (category: ICategory) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />
          
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-[680px]"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 overflow-hidden mt-3">
              <div className="flex">
                {/* Main Categories */}
                <div className="flex-1 py-5 px-4">
                  <div className="space-y-[2px]">
                    {topLevelCategories.slice(0, 8).map((cat) => (
                      <div
                        key={cat._id}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(cat)}
                      >
                        <Link
                          href={`/products?category=${cat.slug}`}
                          onClick={onClose}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                            activeCategory?._id === cat._id
                              ? "bg-zinc-100 dark:bg-white/10"
                              : "hover:bg-zinc-50 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                              activeCategory?._id === cat._id
                                ? "bg-primary text-white"
                                : "bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary"
                            }`}>
                              {getIcon(cat.icon)}
                            </div>
                            <span className={`font-medium text-sm transition-colors ${
                              activeCategory?._id === cat._id
                                ? "text-foreground"
                                : "text-zinc-700 dark:text-zinc-300 group-hover:text-foreground"
                            }`}>
                              {cat.name}
                            </span>
                          </div>
                          {subcategories.length > 0 && (
                            <ChevronRight className={`w-4 h-4 transition-all ${
                              activeCategory?._id === cat._id
                                ? "text-primary opacity-100"
                                : "text-zinc-300 opacity-0 group-hover:opacity-100"
                            }`} />
                          )}
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 px-4 border-t border-zinc-100 dark:border-white/10">
                    <Link
                      href="/categories"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                    >
                      View all categories
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Subcategories Panel */}
                {activeCategory && subcategories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="w-[280px] bg-zinc-50/50 dark:bg-black/20 py-5 px-4 border-l border-zinc-100 dark:border-white/10"
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="mb-3 px-2">
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        {activeCategory.name}
                      </h4>
                    </div>
                    <div className="space-y-[2px]">
                      {subcategories.map((sub) => (
                        <Link
                          key={sub._id}
                          href={`/products?category=${sub.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group"
                        >
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">
                            {sub.name}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Quick Access Panel (when no subcategories) */}
                {!activeCategory && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-[280px] bg-zinc-50/50 dark:bg-black/20 py-5 px-4 border-l border-zinc-100 dark:border-white/10"
                  >
                    <div className="mb-3 px-2">
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Quick Access
                      </h4>
                    </div>
                    <div className="space-y-[2px]">
                      <Link
                        href="/products?sort=newest"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
                          <span className="text-emerald-600 text-sm">✨</span>
                        </div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">
                          New Arrivals
                        </span>
                      </Link>
                      <Link
                        href="/products?sort=bestselling"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center">
                          <span className="text-amber-600 text-sm">🔥</span>
                        </div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">
                          Best Sellers
                        </span>
                      </Link>
                      <Link
                        href="/products?sale=true"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-md bg-rose-500/10 flex items-center justify-center">
                          <span className="text-rose-600 text-sm">⚡</span>
                        </div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">
                          On Sale
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
