import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid MongoDB ObjectId",
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  contactEmail: z.string().email("Invalid contact email"),
  allowRegistration: z.boolean(),
  currency: z.string().min(1, "Default currency is required").optional(),
  stripeEnabled: z.boolean().optional(),
  paypalEnabled: z.boolean().optional(),
  googleAnalyticsId: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

export const adminUpdateUserSchema = z.object({
  userId: objectIdSchema,
  role: z.enum(["user", "admin", "vendor"]).optional(),
  status: z.enum(["active", "banned"]).optional(),
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(200).optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  designation: z.string().optional().or(z.literal("")),
  socialLinks: z.object({
    twitter: z.string().optional().or(z.literal("")),
    linkedin: z.string().optional().or(z.literal("")),
    github: z.string().optional().or(z.literal("")),
    facebook: z.string().optional().or(z.literal("")),
  }).optional(),
});

export const adminDeleteUserSchema = z.object({
  userId: objectIdSchema,
});

const imageGallerySchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional().default(""),
  order: z.number().int().min(0).optional().default(0),
  isPrimary: z.boolean().optional().default(false),
});

const variantSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  barcode: z.string().optional(),
  color: z.string().optional(),
  colorCode: z.string().optional(),
  size: z.string().optional(),
  price: z.number().min(0),
  stock: z.number().int().min(0).default(0),
  images: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

const specificationSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  group: z.string().optional(),
});

const dimensionsSchema = z.object({
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
  unit: z.enum(["cm", "in"]).optional().default("cm"),
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
  category: objectIdSchema,
  brand: z.string().optional(),
  brandRef: objectIdSchema.optional(),
  tags: z.array(z.string()).optional().default([]),
  variants: z.array(variantSchema).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  sizes: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0).default(0),
  sku: z.string().optional(),
  lowStockThreshold: z.number().int().min(0).optional().default(10),
  inventoryTracking: z.boolean().optional().default(true),
  relatedProducts: z.array(objectIdSchema).optional().default([]),
  frequentlyBoughtTogether: z.array(objectIdSchema).optional().default([]),
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
  shippingOptions: z.array(z.object({
    method: z.string().min(1),
    price: z.number().min(0),
    estimatedDays: z.string().min(1),
  })).optional().default([]),
});

export const orderSchema = z.object({
  items: z.array(
    z.object({
      product: z.string(),
      name: z.string().min(1, "Product name is required"),
      quantity: z.number().int().min(1),
      price: z.number().min(0),
      image: z.string().min(1, "Product image is required"),
    })
  ).min(1, "Order must contain at least one item"),
  shippingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  paymentMethod: z.enum(["stripe", "paypal", "cod", "bkash", "nagad", "rocket"]),
  paymentIntentId: z.string().optional(),
  transactionId: z.string().optional(),
  paymentPhoneNumber: z.string().optional(),
  shippingCarrier: z.string().optional(),
  shippingService: z.string().optional(),
  shippingPrice: z.number().min(0).optional(),
  taxPrice: z.number().min(0).optional(),
  totalAmount: z.number().min(0),
});
