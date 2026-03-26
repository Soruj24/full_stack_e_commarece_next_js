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

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  category: objectIdSchema,
  stock: z.number().int().min(0),
  sku: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
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
