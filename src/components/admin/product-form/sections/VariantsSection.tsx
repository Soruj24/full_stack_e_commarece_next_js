"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ProductFormData, ProductFormErrors } from "../types";

interface Variant {
  name: string;
  sku: string;
  price: number;
  stock: number;
  color?: string;
  size?: string;
}

interface VariantsSectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
}

export function VariantsSection({
  formData,
  errors,
  variants,
  onVariantsChange,
}: VariantsSectionProps) {
  const addVariant = () => {
    onVariantsChange([
      ...variants,
      { name: "", sku: "", price: 0, stock: 0, color: "", size: "" },
    ]);
  };

  const removeVariant = (index: number) => {
    onVariantsChange(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    onVariantsChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Add product variants for different options (colors, sizes, etc.)
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariant}
          className="h-8 text-xs gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border/60 rounded-lg">
          No variants added yet
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="p-4 border border-border/60 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Variant {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(index, "name", e.target.value)
                    }
                    placeholder="e.g. Red / Large"
                    className="h-9 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">SKU</Label>
                  <Input
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(index, "sku", e.target.value)
                    }
                    placeholder="VAR-001"
                    className="h-9 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    value={variant.price || ""}
                    onChange={(e) =>
                      updateVariant(index, "price", Number(e.target.value))
                    }
                    placeholder="0.00"
                    className="h-9 rounded-lg text-sm"
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Stock</Label>
                  <Input
                    type="number"
                    value={variant.stock || ""}
                    onChange={(e) =>
                      updateVariant(index, "stock", Number(e.target.value))
                    }
                    placeholder="0"
                    className="h-9 rounded-lg text-sm"
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Color</Label>
                  <Input
                    value={variant.color || ""}
                    onChange={(e) =>
                      updateVariant(index, "color", e.target.value)
                    }
                    placeholder="Red"
                    className="h-9 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
