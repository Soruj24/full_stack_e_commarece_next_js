import mongoose, { Schema, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    logo: { type: String },
    website: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

brandSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "brandRef",
  count: true,
  options: { match: { isActive: true, isArchived: false } },
});

brandSchema.index({ isActive: 1 });
brandSchema.index({ name: "text", description: "text" });

export const Brand =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", brandSchema);
