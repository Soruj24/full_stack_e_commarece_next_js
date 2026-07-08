export interface IBanner {
  _id: string;
  title: string;
  subtitle?: string | undefined;
  image: string;
  link?: string | undefined;
  type: string;
  isActive: boolean;
}

export interface IVariant {
  _id?: string;
  name: string;
  sku: string;
  barcode?: string;
  color?: string;
  colorCode?: string;
  size?: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
}

export interface IImageGallery {
  _id?: string;
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

export interface ISpecification {
  key: string;
  value: string;
  group?: string;
}

export interface IDimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "in";
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountEndDate?: string;
  images: string[];
  imageGallery?: IImageGallery[];
  videoUrl?: string;
  videoType?: "youtube" | "vimeo";
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: string;
  brandRef?: { _id: string; name: string; slug: string; logo?: string };
  tags: string[];
  variants: IVariant[];
  colors: string[];
  sizes: string[];
  stock: number;
  sku?: string;
  lowStockThreshold: number;
  inventoryTracking: boolean;
  relatedProducts: string[];
  frequentlyBoughtTogether: string[];
  specifications: ISpecification[];
  weight?: number;
  weightUnit: "kg" | "lb" | "g" | "oz";
  dimensions?: IDimensions;
  taxClass?: string;
  isTaxable: boolean;
  warranty?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  isFeatured: boolean;
  isActive: boolean;
  isArchived: boolean;
  onSale?: boolean;
  isOnSale?: boolean;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  discountPercentage?: number;
  shippingOptions?: Array<{ method: string; price: number; estimatedDays: string }>;
  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}
