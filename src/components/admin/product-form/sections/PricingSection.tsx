"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "../FormField";
import type { ProductFormData, Category, ProductFormErrors } from "../types";

interface PricingSectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  categories: Category[];
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function PricingSection({
  formData,
  errors,
  categories,
  onChange,
}: PricingSectionProps) {
  const discountPercent =
    formData.discountPrice && formData.price
      ? Math.round(
          ((Number(formData.price) - Number(formData.discountPrice)) /
            Number(formData.price)) *
            100
        )
      : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormField
          label="Price"
          htmlFor="price"
          error={errors.price}
          required
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => onChange("price", e.target.value)}
              placeholder="0.00"
              className="h-10 rounded-lg pl-7"
              min="0"
              step="0.01"
            />
          </div>
        </FormField>

        <FormField
          label="Sale Price"
          htmlFor="discountPrice"
          error={errors.discountPrice}
          description={
            discountPercent > 0 ? `${discountPercent}% off` : undefined
          }
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="discountPrice"
              type="number"
              value={formData.discountPrice}
              onChange={(e) => onChange("discountPrice", e.target.value)}
              placeholder="0.00"
              className="h-10 rounded-lg pl-7"
              min="0"
              step="0.01"
              disabled={!formData.onSale}
            />
          </div>
        </FormField>

        <FormField
          label="Category"
          htmlFor="category"
          error={errors.category}
          required
        >
          <Select
            value={formData.category}
            onValueChange={(v) => onChange("category", v)}
          >
            <SelectTrigger id="category" className="h-10 rounded-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </div>
  );
}
