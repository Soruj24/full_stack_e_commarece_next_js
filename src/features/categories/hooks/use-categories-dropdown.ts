import { useState, useEffect, useRef } from "react";
import { ICategory } from '@/lib/types';
import { CATEGORY_ICON_MAP } from "@/lib/data/category-icons";

export function useCategoriesDropdown(isOpen: boolean, onClose: () => void) {
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
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const getIcon = (iconName?: string) => {
    return iconName ? CATEGORY_ICON_MAP[iconName] || CATEGORY_ICON_MAP.default : CATEGORY_ICON_MAP.default;
  };

  const getCategoryChildren = (categoryId: string) =>
    categories.filter((c) => {
      const parent = c.parent;
      if (typeof parent === "object" && parent !== null) return (parent as ICategory)._id === categoryId;
      return parent === categoryId;
    });

  const topLevelCategories = categories.filter((c) => !c.parent || (typeof c.parent === "string" && !c.parent));
  const subcategories = activeCategory ? getCategoryChildren(activeCategory._id) : [];

  const handleMouseEnter = (category: ICategory) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveCategory(null), 150);
  };

  return {
    categories, activeCategory, dropdownRef, timeoutRef,
    getIcon, topLevelCategories, subcategories,
    handleMouseEnter, handleMouseLeave, onClose,
  };
}
