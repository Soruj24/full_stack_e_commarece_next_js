"use client";

import { Tag, Palette, Maximize2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import type { ProductFormData, ProductFormErrors } from "../types";

interface CategoriesSectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function CategoriesSection({
  formData,
  errors,
  onChange,
}: CategoriesSectionProps) {
  const tags = formData.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const colors = formData.colors
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const sizes = formData.sizes
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      <FormField
        label="Tags"
        htmlFor="tags-input"
        description="Comma-separated tags for search and filtering"
      >
        <Input
          id="tags-input"
          value={formData.tags}
          onChange={(e) => onChange("tags", e.target.value)}
          placeholder="e.g. electronics, new, featured"
          className="h-10 rounded-lg"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded-md text-xs text-muted-foreground"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          label="Colors"
          htmlFor="colors-input"
          description="Comma-separated color options"
        >
          <Input
            id="colors-input"
            value={formData.colors}
            onChange={(e) => onChange("colors", e.target.value)}
            placeholder="e.g. Red, Blue, Green"
            className="h-10 rounded-lg"
          />
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {colors.map((color, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded-md text-xs text-muted-foreground"
                >
                  <Palette className="h-3 w-3" />
                  {color}
                </span>
              ))}
            </div>
          )}
        </FormField>

        <FormField
          label="Sizes"
          htmlFor="sizes-input"
          description="Comma-separated size options"
        >
          <Input
            id="sizes-input"
            value={formData.sizes}
            onChange={(e) => onChange("sizes", e.target.value)}
            placeholder="e.g. S, M, L, XL"
            className="h-10 rounded-lg"
          />
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sizes.map((size, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded-md text-xs text-muted-foreground"
                >
                  <Maximize2 className="h-3 w-3" />
                  {size}
                </span>
              ))}
            </div>
          )}
        </FormField>
      </div>
    </div>
  );
}
