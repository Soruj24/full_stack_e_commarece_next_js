"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ICategory } from "@/types";
import {
  fetchAllCategoriesForParent,
  saveCategory,
} from "@/lib/services/category-service";

interface CategoryDialogState {
  name: string;
  description: string;
  image: string;
  icon: string;
  parent: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
}

const INITIAL_STATE: CategoryDialogState = {
  name: "",
  description: "",
  image: "",
  icon: "",
  parent: "none",
  isFeatured: false,
  isActive: true,
  order: 0,
  metaTitle: "",
  metaDescription: "",
};

export function useCategoryDialog(
  open: boolean,
  category: ICategory | null | undefined,
  onSuccess: () => void,
  onOpenChange: (open: boolean) => void
) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [formData, setFormData] = useState<CategoryDialogState>(INITIAL_STATE);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      const cats = await fetchAllCategoriesForParent(category?._id);
      setCategories(cats);
    };
    load();
  }, [open, category]);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        icon: category.icon || "",
        parent:
          typeof category.parent === "object" && category.parent !== null
            ? (category.parent as ICategory)._id || "none"
            : (category.parent as string) || "none",
        isFeatured: category.isFeatured || false,
        isActive: category.isActive !== false,
        order: category.order || 0,
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [category, open]);

  const updateField = useCallback(
    (key: string, value: string | boolean | number) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const payload: Partial<ICategory> = {
          name: formData.name,
          description: formData.description,
          image: formData.image,
          icon: formData.icon,
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
          order: formData.order,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
        };

        if (formData.parent !== "none") {
          payload.parent = formData.parent;
        } else if (category) {
          payload.parent = null;
        }

        const data = await saveCategory(payload, category?._id);

        if (data.success) {
          toast.success(category ? "Category updated" : "Category created");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(data.error);
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [formData, category, onSuccess, onOpenChange]
  );

  return {
    loading,
    categories,
    showImagePreview,
    setShowImagePreview,
    formData,
    updateField,
    handleSubmit,
  };
}
