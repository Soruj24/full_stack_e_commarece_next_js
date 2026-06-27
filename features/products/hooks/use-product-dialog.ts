"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ProductFormData, Category, Brand } from "@/components/admin/product-form/types";

interface ProductDialogData {
  _id: string;
  name: string;
  description: string;
  price: number | string;
  category: { _id: string; name: string; slug: string };
  stock: number | string;
  brand?: string;
  sku?: string;
  tags?: string[];
  colors?: string[];
  sizes?: string[];
  isFeatured?: boolean;
  isArchived?: boolean;
  onSale?: boolean;
  discountPrice?: number;
  images: string[];
}

const defaultFormData: ProductFormData = {
  name: "", description: "", price: "", category: "", stock: "", brand: "", sku: "",
  tags: "", colors: "", sizes: "", isFeatured: false, isArchived: false, onSale: false,
  discountPrice: "", images: [], newImageUrl: "",
};

export function useProductDialog(product: ProductDialogData | null, open: boolean, onSuccess: () => void, onOpenChange: (open: boolean) => void) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    };
    const fetchBrands = async () => {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      if (data.success) setBrands(data.brands);
    };
    if (open) { fetchCategories(); fetchBrands(); }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name, description: product.description,
        price: product.price.toString(),
        category: (typeof product.category === "object" ? (product.category as { _id: string })._id : product.category) || "",
        stock: product.stock.toString(), brand: product.brand || "", sku: product.sku || "",
        tags: product.tags?.join(", ") || "", colors: product.colors?.join(", ") || "",
        sizes: product.sizes?.join(", ") || "", isFeatured: product.isFeatured || false,
        isArchived: product.isArchived || false, onSale: product.onSale || false,
        discountPrice: product.discountPrice?.toString() || "", images: product.images || [], newImageUrl: "",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [product, open]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = product ? `/api/products/${product._id}` : "/api/products";
      const method = product ? "PATCH" : "POST";
      const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const colorsArray = formData.colors.split(",").map((c) => c.trim()).filter(Boolean);
      const sizesArray = formData.sizes.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, price: Number(formData.price), stock: Number(formData.stock),
          discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
          tags: tagsArray, colors: colorsArray, sizes: sizesArray,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(product ? "Product updated" : "Product created");
        onSuccess();
        onOpenChange(false);
      } else toast.error(data.error);
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  }, [product, formData, onSuccess, onOpenChange]);

  return { loading, categories, brands, formData, setFormData, handleSubmit };
}
