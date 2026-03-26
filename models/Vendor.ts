import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  storeLogo?: string;
  storeBanner?: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  commissionRate: number;
  commissionBalance: number;
  pendingPayout: number;
  totalEarnings: number;
  totalSales: number;
  totalOrders: number;
  rating: number;
  numReviews: number;
  contactEmail: string;
  contactPhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber?: string;
  };
  rejectedReason?: string;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    storeName: { type: String, required: true },
    storeSlug: { type: String, required: true, unique: true },
    storeDescription: { type: String },
    storeLogo: { type: String },
    storeBanner: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    commissionRate: { type: Number, default: 10 },
    commissionBalance: { type: Number, default: 0 },
    pendingPayout: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    bankDetails: {
      bankName: { type: String },
      accountName: { type: String },
      accountNumber: { type: String },
      routingNumber: { type: String },
    },
    rejectedReason: { type: String },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

vendorSchema.index({ storeSlug: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ userId: 1 });

export const Vendor =
  mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", vendorSchema);
