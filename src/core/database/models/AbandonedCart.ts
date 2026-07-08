import mongoose, { Schema, Document } from "mongoose";

export interface IAbandonedCart extends Document {
  email?: string;
  userId?: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant?: string;
  }[];
  totalAmount: number;
  currency: string;
  status: "active" | "recovered" | "expired" | "notified";
  recoveryAttempts: number;
  lastNotifiedAt?: Date;
  recoveredAt?: Date;
  recoveredOrderId?: mongoose.Types.ObjectId;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const abandonedCartSchema = new Schema<IAbandonedCart>(
  {
    email: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        variant: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["active", "recovered", "expired", "notified"],
      default: "active",
    },
    recoveryAttempts: { type: Number, default: 0 },
    lastNotifiedAt: { type: Date },
    recoveredAt: { type: Date },
    recoveredOrderId: { type: Schema.Types.ObjectId, ref: "Order" },
    userAgent: { type: String },
    ipAddress: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

abandonedCartSchema.index({ email: 1 });
abandonedCartSchema.index({ userId: 1 });
abandonedCartSchema.index({ status: 1 });
abandonedCartSchema.index({ expiresAt: 1 });

export const AbandonedCart =
  mongoose.models.AbandonedCart || mongoose.model<IAbandonedCart>("AbandonedCart", abandonedCartSchema);
