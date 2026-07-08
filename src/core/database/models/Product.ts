import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
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

export interface IImageGalleryItem {
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

export interface IShippingOption {
  method: string;
  price: number;
  estimatedDays: string;
}

export interface IReview {
  user: Schema.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: Date;
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

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountEndDate?: Date;
  images: string[];
  imageGallery: IImageGalleryItem[];
  videoUrl?: string;
  videoType?: "youtube" | "vimeo";
  category: Schema.Types.ObjectId;
  brand?: string;
  brandRef?: Schema.Types.ObjectId;
  tags: string[];
  variants: IVariant[];
  colors: string[];
  sizes: string[];
  stock: number;
  sku?: string;
  lowStockThreshold: number;
  inventoryTracking: boolean;
  relatedProducts: Schema.Types.ObjectId[];
  frequentlyBoughtTogether: Schema.Types.ObjectId[];
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
  shippingOptions: IShippingOption[];
  rating: number;
  numReviews: number;
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IVariant>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    barcode: { type: String },
    color: { type: String },
    colorCode: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const imageGallerySchema = new Schema<IImageGalleryItem>(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: true }
);

const specificationSchema = new Schema<ISpecification>(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
    group: { type: String },
  },
  { _id: false }
);

const dimensionsSchema = new Schema<IDimensions>(
  {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    unit: { type: String, enum: ["cm", "in"], default: "cm" },
  },
  { _id: false }
);

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const shippingOptionSchema = new Schema<IShippingOption>(
  {
    method: { type: String, required: true },
    price: { type: Number, required: true },
    estimatedDays: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    discountEndDate: { type: Date },
    images: [{ type: String }],
    imageGallery: [imageGallerySchema],
    videoUrl: { type: String },
    videoType: { type: String, enum: ["youtube", "vimeo"] },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String },
    brandRef: { type: Schema.Types.ObjectId, ref: "Brand" },
    tags: [{ type: String }],
    variants: [variantSchema],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String },
    lowStockThreshold: { type: Number, default: 10 },
    inventoryTracking: { type: Boolean, default: true },
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    frequentlyBoughtTogether: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    specifications: [specificationSchema],
    weight: { type: Number, min: 0 },
    weightUnit: { type: String, enum: ["kg", "lb", "g", "oz"], default: "kg" },
    dimensions: dimensionsSchema,
    taxClass: { type: String },
    isTaxable: { type: Boolean, default: true },
    warranty: { type: String },
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
    canonicalUrl: { type: String },
    ogImage: { type: String },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    shippingOptions: [shippingOptionSchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("onSale").get(function () {
  if (!this.discountPrice) return false;
  if (this.discountEndDate && this.discountEndDate < new Date()) return false;
  return this.discountPrice < this.price;
});

productSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "out_of_stock";
  if (this.stock <= this.lowStockThreshold) return "low_stock";
  return "in_stock";
});

productSchema.virtual("discountPercentage").get(function () {
  if (!this.discountPrice || this.price === 0) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

productSchema.pre("save", function () {
  if (this.variants && this.variants.length > 0) {
    const activeVariants = this.variants.filter((v: IVariant) => v.isActive);
    this.colors = [...new Set(activeVariants.filter((v: IVariant) => v.color).map((v: IVariant) => v.color!))];
    this.sizes = [...new Set(activeVariants.filter((v: IVariant) => v.size).map((v: IVariant) => v.size!))];
    this.stock = activeVariants.reduce((sum: number, v: IVariant) => sum + v.stock, 0);
    if (!this.sku && this.variants[0]?.sku) {
      this.sku = this.variants[0].sku;
    }
  }
});

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ brandRef: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isActive: 1, isArchived: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ "variants.sku": 1 });
productSchema.index({ relatedProducts: 1 });
productSchema.index({ frequentlyBoughtTogether: 1 });
productSchema.index({ tags: 1 });
productSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 10, description: 5 } }
);

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
