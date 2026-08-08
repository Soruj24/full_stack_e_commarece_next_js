"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Image,
  DollarSign,
  Warehouse,
  Tag,
  Layers,
  Truck,
  Search,
  ToggleLeft,
} from "lucide-react";
import { FormSection } from "./FormSection";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { ImagesSection } from "./sections/ImagesSection";
import { PricingSection } from "./sections/PricingSection";
import { InventorySection } from "./sections/InventorySection";
import { CategoriesSection } from "./sections/CategoriesSection";
import { VariantsSection } from "./sections/VariantsSection";
import { ShippingSection } from "./sections/ShippingSection";
import { SEOSection } from "./sections/SEOSection";
import { StatusSection } from "./sections/StatusSection";
import { StickyActionBar } from "./StickyActionBar";
import type {
  ProductFormData,
  ProductFormErrors,
  Category,
  Brand,
} from "./types";
import { defaultProductFormData } from "./types";

interface Variant {
  name: string;
  sku: string;
  price: number;
  stock: number;
  color?: string;
  size?: string;
}

interface ProductFormProps {
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
    variants?: Variant[];
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
  categories: Category[];
  brands: Brand[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onDraft?: (data: ProductFormData) => Promise<void>;
}

export function ProductForm({
  product,
  categories,
  brands,
  onSubmit,
  onDraft,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(defaultProductFormData);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<string>("");

  useEffect(() => {
    if (product) {
      const data: ProductFormData = {
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category:
          typeof product.category === "object"
            ? product.category._id
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
        shippingPrice:
          product.shippingOptions?.[0]?.price?.toString() || "",
        shippingDays:
          product.shippingOptions?.[0]?.estimatedDays || "",
        isTaxable: product.isTaxable !== false,
        taxClass: product.taxClass || "standard",
      };
      setFormData(data);
      setVariants(product.variants || []);
      setInitialData(JSON.stringify({ ...data, variants: product.variants }));
    } else {
      setFormData(defaultProductFormData);
      setVariants([]);
      setInitialData(JSON.stringify({ ...defaultProductFormData, variants: [] }));
    }
  }, [product]);

  const hasChanges =
    JSON.stringify({ ...formData, variants }) !== initialData;

  const validate = useCallback((): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.stock || Number(formData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }
    if (
      formData.discountPrice &&
      formData.price &&
      Number(formData.discountPrice) >= Number(formData.price)
    ) {
      newErrors.discountPrice = "Sale price must be less than regular price";
    }
    if (formData.metaTitle && formData.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title must be 60 characters or less";
    }
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription =
        "Meta description must be 160 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (field: keyof ProductFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof ProductFormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  }, [formData, validate, onSubmit]);

  const handleSaveDraft = useCallback(async () => {
    if (onDraft) {
      setLoading(true);
      try {
        await onDraft(formData);
      } finally {
        setLoading(false);
      }
    }
  }, [formData, onDraft]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const imageCount = formData.images.length;
  const variantCount = variants.length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <FormSection
          title="Basic Information"
          description="Product name, description, and brand"
          icon={Package}
          defaultOpen
        >
          <BasicInfoSection
            formData={formData}
            errors={errors}
            brands={brands}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="Product Images"
          description="Upload and manage product photos"
          icon={Image}
          badge={imageCount > 0 ? `${imageCount} images` : undefined}
        >
          <ImagesSection
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onImagesChange={(images) =>
              setFormData((prev) => ({ ...prev, images }))
            }
          />
        </FormSection>

        <FormSection
          title="Pricing"
          description="Set price, sale price, and category"
          icon={DollarSign}
        >
          <PricingSection
            formData={formData}
            errors={errors}
            categories={categories}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="Inventory"
          description="Stock quantity, SKU, and tracking"
          icon={Warehouse}
        >
          <InventorySection
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="Categories & Attributes"
          description="Tags, colors, and sizes"
          icon={Tag}
        >
          <CategoriesSection
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="Variants"
          description="Product options like color, size, etc."
          icon={Layers}
          badge={variantCount > 0 ? `${variantCount} variants` : undefined}
          defaultOpen={false}
        >
          <VariantsSection
            formData={formData}
            errors={errors}
            variants={variants}
            onVariantsChange={setVariants}
          />
        </FormSection>

        <FormSection
          title="Shipping"
          description="Weight, dimensions, and shipping options"
          icon={Truck}
          defaultOpen={false}
        >
          <ShippingSection
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="SEO"
          description="Meta title, description, and social sharing"
          icon={Search}
          defaultOpen={false}
        >
          <SEOSection
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="Product Status"
          description="Visibility, featured, and sale status"
          icon={ToggleLeft}
        >
          <StatusSection
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        </FormSection>
      </div>

      <StickyActionBar
        isEditing={!!product}
        loading={loading}
        hasChanges={hasChanges}
        onSaveDraft={handleSaveDraft}
        onPublish={handleSubmit}
        onCancel={() => {
          if (hasChanges) {
            if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
              // Parent handles close
            }
          }
        }}
      />
    </div>
  );
}
