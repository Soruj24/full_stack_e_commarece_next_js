import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: Schema.Types.ObjectId;
  stock: number;
  sku?: string;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  shippingOptions?: {
    method: string;
    price: number;
    estimatedDays: string;
  }[];
  isFeatured: boolean;
  isArchived: boolean;
  rating: number;
  numReviews: number;
  reviews: {
    user: Schema.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
    isVerified: boolean;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String },
    brand: { type: String },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    tags: [{ type: String }],
    shippingOptions: [{
      method: { type: String },
      price: { type: Number },
      estimatedDays: { type: String }
    }],
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
