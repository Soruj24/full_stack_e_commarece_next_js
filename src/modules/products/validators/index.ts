import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  category: z.string(),
  stock: z.number().int().min(0),
  sku: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});
