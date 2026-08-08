"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "../FormField";
import type { ProductFormData, ProductFormErrors } from "../types";

interface SEOSectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function SEOSection({
  formData,
  errors,
  onChange,
}: SEOSectionProps) {
  const titleLength = formData.metaTitle.length;
  const descLength = formData.metaDescription.length;

  return (
    <div className="space-y-5">
      <FormField
        label="Meta Title"
        htmlFor="metaTitle"
        error={errors.metaTitle}
        description={`${titleLength}/60 characters`}
      >
        <Input
          id="metaTitle"
          value={formData.metaTitle}
          onChange={(e) => onChange("metaTitle", e.target.value)}
          placeholder="SEO title for search engines"
          className="h-10 rounded-lg"
          maxLength={60}
        />
      </FormField>

      <FormField
        label="Meta Description"
        htmlFor="metaDescription"
        error={errors.metaDescription}
        description={`${descLength}/160 characters`}
      >
        <Textarea
          id="metaDescription"
          value={formData.metaDescription}
          onChange={(e) => onChange("metaDescription", e.target.value)}
          placeholder="SEO description for search engines"
          className="min-h-[80px] rounded-lg resize-y"
          maxLength={160}
        />
      </FormField>

      <FormField
        label="Canonical URL"
        htmlFor="canonicalUrl"
        description="Optional custom URL for this product"
      >
        <Input
          id="canonicalUrl"
          value={formData.canonicalUrl}
          onChange={(e) => onChange("canonicalUrl", e.target.value)}
          placeholder="https://example.com/products/my-product"
          className="h-10 rounded-lg"
        />
      </FormField>

      <FormField
        label="OG Image URL"
        htmlFor="ogImage"
        description="Image for social media sharing"
      >
        <Input
          id="ogImage"
          value={formData.ogImage}
          onChange={(e) => onChange("ogImage", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="h-10 rounded-lg"
        />
      </FormField>
    </div>
  );
}
