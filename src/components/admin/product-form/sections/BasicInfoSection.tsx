"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "../FormField";
import type { ProductFormData, Brand, ProductFormErrors } from "../types";

interface BasicInfoSectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  brands: Brand[];
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function BasicInfoSection({
  formData,
  errors,
  brands,
  onChange,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          label="Product Name"
          htmlFor="name"
          error={errors.name}
          required
        >
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Ultra Slim Pro"
            className="h-10 rounded-lg"
          />
        </FormField>

        <FormField label="Brand" htmlFor="brand">
          <Select
            value={formData.brand}
            onValueChange={(v) => onChange("brand", v)}
          >
            <SelectTrigger id="brand" className="h-10 rounded-lg">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.length === 0 ? (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  No brands available
                </div>
              ) : (
                brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField
        label="Description"
        htmlFor="description"
        error={errors.description}
        required
      >
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Detailed product description..."
          className="min-h-[120px] rounded-lg resize-y"
        />
      </FormField>

      <FormField label="Tags" htmlFor="tags" description="Comma-separated">
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => onChange("tags", e.target.value)}
          placeholder="e.g. electronics, new, featured"
          className="h-10 rounded-lg"
        />
      </FormField>
    </div>
  );
}
