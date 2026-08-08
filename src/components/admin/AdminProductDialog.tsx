"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form/ProductForm";
import { useProductDialog } from "@/modules/products/hooks/use-product-dialog";

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
  } | null;
  onSuccess: () => void;
}

export function AdminProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductDialogProps) {
  const { loading, categories, brands, formData, setFormData, handleSubmit } =
    useProductDialog(product ?? null, open, onSuccess, onOpenChange);

  const handleFormSubmit = async (data: typeof formData) => {
    const syntheticEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
    } as React.FormEvent;
    await handleSubmit(syntheticEvent);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-5 py-4 border-b border-border/60">
          <DialogTitle className="text-lg font-semibold">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ProductForm
            product={product}
            categories={categories}
            brands={brands}
            onSubmit={handleFormSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
