export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  brand: string;
  sku: string;
  tags: string;
  colors: string;
  sizes: string;
  isFeatured: boolean;
  isArchived: boolean;
  isActive: boolean;
  onSale: boolean;
  discountPrice: string;
  images: string[];
  newImageUrl: string;
  lowStockThreshold: string;
  inventoryTracking: boolean;
  weight: string;
  weightUnit: "kg" | "lb" | "g" | "oz";
  dimensionsLength: string;
  dimensionsWidth: string;
  dimensionsHeight: string;
  dimensionsUnit: "cm" | "in";
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  shippingPrice: string;
  shippingDays: string;
  isTaxable: boolean;
  taxClass: string;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  discountPrice?: string;
  images?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Brand {
  _id: string;
  name: string;
}

export const defaultProductFormData: ProductFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  brand: "",
  sku: "",
  tags: "",
  colors: "",
  sizes: "",
  isFeatured: false,
  isArchived: false,
  isActive: true,
  onSale: false,
  discountPrice: "",
  images: [],
  newImageUrl: "",
  lowStockThreshold: "10",
  inventoryTracking: true,
  weight: "",
  weightUnit: "kg",
  dimensionsLength: "",
  dimensionsWidth: "",
  dimensionsHeight: "",
  dimensionsUnit: "cm",
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogImage: "",
  shippingPrice: "",
  shippingDays: "",
  isTaxable: true,
  taxClass: "standard",
};
