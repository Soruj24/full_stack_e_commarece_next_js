"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, TrendingUp, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICategory } from "@/shared/types";
import {
  Laptop, Smartphone, Watch, Headphones,
  Camera, Gamepad2, Shirt, ShoppingBag, Gem,
  Armchair, Baby, Dumbbell, BookOpen, Paintbrush, Sofa,
} from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  laptop: Laptop, phones: Smartphone, watches: Watch, headphones: Headphones,
  camera: Camera, gamepad: Gamepad2, shirt: Shirt, gem: Gem,
  armchair: Armchair, baby: Baby, dumbbell: Dumbbell, book: BookOpen,
  paintbrush: Paintbrush, sofa: Sofa,
};

const gradients: Record<string, string> = {
  laptop: "from-blue-500 to-cyan-500", phones: "from-violet-500 to-purple-500",
  watches: "from-amber-500 to-orange-500", headphones: "from-emerald-500 to-teal-500",
  camera: "from-yellow-500 to-amber-500", gamepad: "from-indigo-500 to-blue-500",
  shirt: "from-pink-500 to-rose-500", gem: "from-purple-500 to-fuchsia-500",
  default: "from-zinc-500 to-zinc-600",
};

const quickLinks = [
  { name: "New Arrivals", href: "/products?sort=newest", icon: Sparkles, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" },
  { name: "Best Sellers", href: "/products?sort=bestselling", icon: TrendingUp, color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10" },
  { name: "On Sale", href: "/products?sale=true", icon: Zap, color: "text-rose-600 bg-rose-50 dark:bg-rose-500/10" },
];

function getIcon(name?: string) {
  const C = iconMap[name || ""] || ShoppingBag;
  return <C className="w-4 h-4" />;
}

export const MegaMenu = memo(function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [active, setActive] = useState<ICategory | null>(null);
  const [subs, setSubs] = useState<ICategory[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetch("/api/categories?active=true&sortBy=order")
        .then((r) => r.json())
        .then((d) => { if (d.success) setCategories(d.categories); })
        .catch(() => {});
    }
  }, [isOpen, categories.length]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onCatEnter = useCallback((cat: ICategory) => {
    if (timer.current) clearTimeout(timer.current);
    setActive(cat);
    setSubs(cat.children || []);
  }, []);

  const onLeave = useCallback(() => {
    timer.current = setTimeout(() => { setActive(null); setSubs([]); }, 120);
  }, []);

  const onPanelEnter = useCallback(() => { if (timer.current) clearTimeout(timer.current); }, []);

  const topLevel = categories.filter((c) => c.parent == null).slice(0, 10);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40"
            onClick={onClose}
            onMouseLeave={onLeave}
          />

          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-full max-w-5xl"
            onMouseEnter={onPanelEnter}
            onMouseLeave={onLeave}
          >
            <div className="mx-4 mt-1 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl shadow-black/8 border border-black/[0.06] dark:border-white/[0.08] overflow-hidden">
              <div className="flex min-h-[380px]">
                {/* Left — Categories */}
                <div className="w-[280px] border-r border-black/[0.06] dark:border-white/[0.08] py-4 px-2 overflow-y-auto max-h-[420px] shrink-0">
                  {topLevel.map((cat) => {
                    const isActive = active?._id === cat._id;
                    const grad = gradients[cat.icon || "default"];
                    return (
                      <div key={cat._id} onMouseEnter={() => onCatEnter(cat)}>
                        <Link
                          href={`/products?category=${cat.slug}`}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group",
                            isActive ? "bg-primary/[0.04]" : "hover:bg-black/[0.03] dark:hover:bg-white/[0.03]",
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105",
                            grad,
                          )}>
                            <div className="text-white">{getIcon(cat.icon)}</div>
                          </div>
                          <span className={cn(
                            "flex-1 text-[13px] font-medium truncate transition-colors",
                            isActive ? "text-foreground" : "text-zinc-600 dark:text-zinc-400 group-hover:text-foreground",
                          )}>
                            {cat.name}
                          </span>
                          <ArrowRight className={cn(
                            "w-3.5 h-3.5 transition-all",
                            isActive ? "text-primary opacity-100" : "text-zinc-300 opacity-0 group-hover:opacity-100",
                          )} />
                        </Link>
                      </div>
                    );
                  })}
                  <div className="mt-2 pt-2 mx-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                    <Link href="/categories" onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-medium text-primary hover:bg-primary/5 transition-colors">
                      View all categories <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right — Dynamic content */}
                <div className="flex-1 p-6">
                  {active && subs.length > 0 ? (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{active.name}</h4>
                        <div className="flex-1 h-px bg-border/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-0.5">
                        {subs.map((sub) => (
                          <Link key={sub._id} href={`/products?category=${sub.slug}`} onClick={onClose}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors group">
                            <span className="text-[13px] text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">{sub.name}</span>
                            <ArrowRight className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/40">
                        <Link href={`/products?category=${active.slug}`} onClick={onClose}
                          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
                          View all {active.name} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Quick Links</h4>
                          <div className="flex-1 h-px bg-border/50" />
                        </div>
                        <div className="space-y-0.5">
                          {quickLinks.map((ql) => (
                            <Link key={ql.name} href={ql.href} onClick={onClose}
                              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors group">
                              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", ql.color)}>
                                <ql.icon className="w-4 h-4" />
                              </div>
                              <span className="flex-1 text-[13px] font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-foreground transition-colors">{ql.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-primary/[0.04] to-primary/[0.08] border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Featured Collection</span>
                        </div>
                        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                          Discover our handpicked selection of premium products curated just for you.
                        </p>
                        <Link href="/products?featured=true" onClick={onClose}
                          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors">
                          Shop Featured <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
