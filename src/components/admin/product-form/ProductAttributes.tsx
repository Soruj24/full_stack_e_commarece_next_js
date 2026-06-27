"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormData } from "./types";

interface ProductAttributesProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
}

export function ProductAttributes({
  formData,
  setFormData,
}: ProductAttributesProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
            SKU
          </Label>
          <Input
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Ex: PROD-001"
            className="h-14 rounded-2xl bg-muted/50 border-border/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
            Tags (Comma separated)
          </Label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Ex: electronics, new, featured"
            className="h-14 rounded-2xl bg-muted/50 border-border/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
            Colors (Comma separated)
          </Label>
          <Input
            value={formData.colors}
            onChange={(e) =>
              setFormData({ ...formData, colors: e.target.value })
            }
            placeholder="Ex: Red, Blue, Green"
            className="h-14 rounded-2xl bg-muted/50 border-border/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
            Sizes (Comma separated)
          </Label>
          <Input
            value={formData.sizes}
            onChange={(e) =>
              setFormData({ ...formData, sizes: e.target.value })
            }
            placeholder="Ex: S, M, L, XL"
            className="h-14 rounded-2xl bg-muted/50 border-border/50"
          />
        </div>
      </div>
    </div>
  );
}
