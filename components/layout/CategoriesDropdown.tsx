"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCategoriesDropdown } from "@/features/categories/hooks/use-categories-dropdown";
import { CategoryMainList } from "./categories-dropdown/CategoryMainList";
import { SubcategoriesPanel } from "./categories-dropdown/SubcategoriesPanel";
import { QuickAccessPanel } from "./categories-dropdown/QuickAccessPanel";

interface CategoriesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoriesDropdown({ isOpen, onClose }: CategoriesDropdownProps) {
  const { activeCategory, dropdownRef, timeoutRef, getIcon, topLevelCategories, subcategories, handleMouseEnter, handleMouseLeave } = useCategoriesDropdown(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" onClick={onClose} />
          <motion.div ref={dropdownRef}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-[680px]">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 overflow-hidden mt-3">
              <div className="flex">
                <CategoryMainList
                  categories={topLevelCategories}
                  activeCategory={activeCategory}
                  subcategories={subcategories}
                  getIcon={getIcon}
                  onMouseEnter={handleMouseEnter}
                  onClose={onClose}
                />
                {activeCategory && subcategories.length > 0 ? (
                  <SubcategoriesPanel
                    activeCategory={activeCategory}
                    subcategories={subcategories}
                    onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
                    onMouseLeave={handleMouseLeave}
                    onClose={onClose}
                  />
                ) : (
                  <QuickAccessPanel onClose={onClose} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
