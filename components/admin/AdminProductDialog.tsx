"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductFormData, Category, Brand } from "./product-form/types";
import { ProductBasicInfo } from "./product-form/ProductBasicInfo";
import { ProductPricing } from "./product-form/ProductPricing";
import { ProductAttributes } from "./product-form/ProductAttributes";
import { ProductSettings } from "./product-form/ProductSettings";
import { ProductImageUpload } from "./product-form/ProductImageUpload";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: {
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
  } | null;
  onSuccess: () => void;
}

export function AdminProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    brand: "",
    sku: "",
    tags: "",
    colors: "",
    sizes: "",
    isFeatured: false,
    isArchived: false,
    onSale: false,
    discountPrice: "",
    images: [],
    newImageUrl: "",
  });

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
          (typeof product.category === "object"
            ? (product.category as { _id: string })._id
            : product.category) || "",
        stock: product.stock.toString(),
        brand: product.brand || "",
        sku: product.sku || "",
        tags: product.tags?.join(", ") || "",
        colors: product.colors?.join(", ") || "",
        sizes: product.sizes?.join(", ") || "",
        isFeatured: product.isFeatured || false,
        isArchived: product.isArchived || false,
        onSale: product.onSale || false,
        discountPrice: product.discountPrice?.toString() || "",
        images: product.images || [],
        newImageUrl: "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        brand: "",
        sku: "",
        tags: "",
        colors: "",
        sizes: "",
        isFeatured: false,
        isArchived: false,
        onSale: false,
        discountPrice: "",
        images: [],
        newImageUrl: "",
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-[40px] p-10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-black tracking-tighter">
            {product ? "Edit" : "Add New"}{" "}
            <span className="text-primary">Product</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <ProductBasicInfo
            formData={formData}
            setFormData={setFormData}
            brands={brands}
          />

          <ProductPricing
            formData={formData}
            setFormData={setFormData}
            categories={categories}
          />

          <ProductAttributes formData={formData} setFormData={setFormData} />

          <ProductSettings formData={formData} setFormData={setFormData} />

          <ProductImageUpload formData={formData} setFormData={setFormData} />

          <DialogFooter className="pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-14 px-8 rounded-2xl border-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-14 px-8 rounded-2xl font-bold text-base shadow-xl shadow-primary/20"
            >
              {loading
                ? "Saving..."
                : product
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
