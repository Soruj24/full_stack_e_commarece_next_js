import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBundleProduct {
  product: Types.ObjectId;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface IBundle extends Document {
  name: string;
  slug: string;
  description: string;
  products: IBundleProduct[];
  originalPrice: number;
  bundlePrice: number;
  discount: number;
  discountPercentage: number;
  stock: number;
  images: string[];
  category: Types.ObjectId;
  brand?: string;
  isActive: boolean;
  validFrom: Date;
  validUntil?: Date;
  maxQuantityPerOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const bundleProductSchema = new Schema<IBundleProduct>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const bundleSchema = new Schema<IBundle>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    products: { type: [bundleProductSchema], required: true },
    originalPrice: { type: Number, required: true },
    bundlePrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    stock: { type: Number, required: true, default: 100 },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String },
    isActive: { type: Boolean, default: true },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },
    maxQuantityPerOrder: { type: Number, default: 10 },
  },
  { timestamps: true }
);

bundleSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
bundleSchema.index({ category: 1 });
bundleSchema.index({ slug: 1 });

export const Bundle =
  mongoose.models.Bundle || mongoose.model<IBundle>("Bundle", bundleSchema);
