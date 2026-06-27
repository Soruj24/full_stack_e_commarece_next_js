"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ICategory } from '@/lib/types';
import { MegaMenuFeaturedCategories } from "./mega-menu/MegaMenuFeaturedCategories";
import { MegaMenuAllCategories } from "./mega-menu/MegaMenuAllCategories";
import { MegaMenuFeaturedProducts } from "./mega-menu/MegaMenuFeaturedProducts";
import { MegaMenuPromoBanners } from "./mega-menu/MegaMenuPromoBanners";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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

  const featuredCategories = categories.filter((c) => c.isFeatured).slice(0, 4);
  const otherCategories = categories.filter((c) => !c.isFeatured).slice(0, 8);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-50"
          >
            <div className="bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl shadow-black/10">
              <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-12 gap-8">
                  <MegaMenuFeaturedCategories categories={featuredCategories} onClose={onClose} />
                  <MegaMenuAllCategories
                    categories={otherCategories}
                    onClose={onClose}
                    hoveredCategory={hoveredCategory}
                    setHoveredCategory={setHoveredCategory}
                  />
                  <MegaMenuFeaturedProducts onClose={onClose} />
                </div>
                <MegaMenuPromoBanners onClose={onClose} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
