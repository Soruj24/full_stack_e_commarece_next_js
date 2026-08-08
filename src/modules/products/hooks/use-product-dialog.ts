"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  ProductFormData,
  Category,
  Brand,
  defaultProductFormData,
} from "@/components/admin/product-form/types";

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
  isActive?: boolean;
  onSale?: boolean;
  discountPrice?: number;
  images: string[];
  variants?: Array<{
    name: string;
    sku: string;
    price: number;
    stock: number;
    color?: string;
    size?: string;
  }>;
  weight?: number;
  weightUnit?: "kg" | "lb" | "g" | "oz";
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "in";
  };
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  lowStockThreshold?: number;
  inventoryTracking?: boolean;
  isTaxable?: boolean;
  taxClass?: string;
  shippingOptions?: Array<{
    method: string;
    price: number;
    estimatedDays: string;
  }>;
}

export function useProductDialog(
  product: ProductDialogData | null,
  open: boolean,
  onSuccess: () => void,
  onOpenChange: (open: boolean) => void
) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState<ProductFormData>(defaultProductFormData);

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
    if (open) {
      fetchCategories();
      fetchBrands();
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category:
          typeof product.category === "object"
            ? (product.category as { _id: string })._id
            : product.category || "",
        stock: product.stock.toString(),
        brand: product.brand || "",
        sku: product.sku || "",
        tags: product.tags?.join(", ") || "",
        colors: product.colors?.join(", ") || "",
        sizes: product.sizes?.join(", ") || "",
        isFeatured: product.isFeatured || false,
        isArchived: product.isArchived || false,
        isActive: product.isActive !== false,
        onSale: product.onSale || false,
        discountPrice: product.discountPrice?.toString() || "",
        images: product.images || [],
        newImageUrl: "",
        lowStockThreshold: product.lowStockThreshold?.toString() || "10",
        inventoryTracking: product.inventoryTracking !== false,
        weight: product.weight?.toString() || "",
        weightUnit: product.weightUnit || "kg",
        dimensionsLength: product.dimensions?.length?.toString() || "",
        dimensionsWidth: product.dimensions?.width?.toString() || "",
        dimensionsHeight: product.dimensions?.height?.toString() || "",
        dimensionsUnit: product.dimensions?.unit || "cm",
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
        canonicalUrl: product.canonicalUrl || "",
        ogImage: product.ogImage || "",
        shippingPrice: product.shippingOptions?.[0]?.price?.toString() || "",
        shippingDays: product.shippingOptions?.[0]?.estimatedDays || "",
        isTaxable: product.isTaxable !== false,
        taxClass: product.taxClass || "standard",
      });
    } else {
      setFormData(defaultProductFormData);
    }
  }, [product, open]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const url = product ? `/api/products/${product._id}` : "/api/products";
        const method = product ? "PATCH" : "POST";
        const tagsArray = formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        const colorsArray = formData.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
        const sizesArray = formData.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            discountPrice: formData.discountPrice
              ? Number(formData.discountPrice)
              : undefined,
            lowStockThreshold: Number(formData.lowStockThreshold),
            weight: formData.weight ? Number(formData.weight) : undefined,
            dimensions:
              formData.dimensionsLength || formData.dimensionsWidth || formData.dimensionsHeight
                ? {
                    length: Number(formData.dimensionsLength) || 0,
                    width: Number(formData.dimensionsWidth) || 0,
                    height: Number(formData.dimensionsHeight) || 0,
                    unit: formData.dimensionsUnit,
                  }
                : undefined,
            shippingOptions:
              formData.shippingPrice || formData.shippingDays
                ? [
                    {
                      method: "standard",
                      price: Number(formData.shippingPrice) || 0,
                      estimatedDays: formData.shippingDays || "3-5",
                    },
                  ]
                : undefined,
            tags: tagsArray,
            colors: colorsArray,
            sizes: sizesArray,
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(product ? "Product updated" : "Product created");
          onSuccess();
          onOpenChange(false);
        } else toast.error(data.error);
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [product, formData, onSuccess, onOpenChange]
  );

  return { loading, categories, brands, formData, setFormData, handleSubmit };
}
