import { z } from "zod";

const imageGallerySchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  alt: z.string().optional().default(""),
  order: z.number().int().min(0).optional().default(0),
  isPrimary: z.boolean().optional().default(false),
});

const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  color: z.string().optional(),
  colorCode: z.string().optional(),
  size: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative").default(0),
  images: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

const specificationSchema = z.object({
  key: z.string().min(1, "Specification key is required"),
  value: z.string().min(1, "Specification value is required"),
  group: z.string().optional(),
});

const dimensionsSchema = z.object({
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
  unit: z.enum(["cm", "in"]).optional().default("cm"),
});

const shippingOptionSchema = z.object({
  method: z.string().min(1, "Shipping method is required"),
  price: z.number().min(0),
  estimatedDays: z.string().min(1),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().optional(),
  discountEndDate: z.string().datetime().optional().nullable(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  imageGallery: z.array(imageGallerySchema).optional().default([]),
  videoUrl: z.string().url().optional().or(z.literal("")),
  videoType: z.enum(["youtube", "vimeo"]).optional(),
  category: z.string(),
  brand: z.string().optional(),
  brandRef: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  variants: z.array(variantSchema).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  sizes: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0, "Stock cannot be negative").default(0),
  sku: z.string().optional(),
  lowStockThreshold: z.number().int().min(0).optional().default(10),
  inventoryTracking: z.boolean().optional().default(true),
  relatedProducts: z.array(z.string()).optional().default([]),
  frequentlyBoughtTogether: z.array(z.string()).optional().default([]),
  specifications: z.array(specificationSchema).optional().default([]),
  weight: z.number().min(0).optional(),
  weightUnit: z.enum(["kg", "lb", "g", "oz"]).optional().default("kg"),
  dimensions: dimensionsSchema.optional(),
  taxClass: z.string().optional(),
  isTaxable: z.boolean().optional().default(true),
  warranty: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  ogImage: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  isArchived: z.boolean().optional().default(false),
  shippingOptions: z.array(shippingOptionSchema).optional().default([]),
});
