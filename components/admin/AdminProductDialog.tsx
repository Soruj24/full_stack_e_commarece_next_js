"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProductDialog } from "@/hooks/use-product-dialog";
import { ProductBasicInfo } from "./product-form/ProductBasicInfo";
import { ProductPricing } from "./product-form/ProductPricing";
import { ProductAttributes } from "./product-form/ProductAttributes";
import { ProductSettings } from "./product-form/ProductSettings";
import { ProductImageUpload } from "./product-form/ProductImageUpload";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: {
    _id: string; name: string; description: string; price: number | string;
    category: { _id: string; name: string; slug: string }; stock: number | string;
    brand?: string; sku?: string; tags?: string[]; colors?: string[]; sizes?: string[];
    isFeatured?: boolean; isArchived?: boolean; onSale?: boolean; discountPrice?: number; images: string[];
  } | null;
  onSuccess: () => void;
}

export function AdminProductDialog({ open, onOpenChange, product, onSuccess }: ProductDialogProps) {
  const { loading, categories, brands, formData, setFormData, handleSubmit } = useProductDialog(product ?? null, open, onSuccess, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-[40px] p-10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-black tracking-tighter">{product ? "Edit" : "Add New"} <span className="text-primary">Product</span></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <ProductBasicInfo formData={formData} setFormData={setFormData} brands={brands} />
          <ProductPricing formData={formData} setFormData={setFormData} categories={categories} />
          <ProductAttributes formData={formData} setFormData={setFormData} />
          <ProductSettings formData={formData} setFormData={setFormData} />
          <ProductImageUpload formData={formData} setFormData={setFormData} />
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-14 px-8 rounded-2xl border-2">Cancel</Button>
            <Button type="submit" disabled={loading} className="h-14 px-8 rounded-2xl font-bold text-base shadow-xl shadow-primary/20">
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
