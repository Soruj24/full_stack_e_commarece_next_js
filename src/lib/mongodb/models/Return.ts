import mongoose, { Schema, Document } from "mongoose";

export interface IReturn extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    quantity: number;
    price: number;
    reason: string;
    condition: "opened" | "sealed" | "damaged";
    images?: string[];
  }[];
  status: "pending" | "approved" | "rejected" | "received" | "refunded" | "cancelled";
  reason: string;
  description: string;
  refundAmount: number;
  refundMethod: "original" | "store_credit" | "bank_transfer";
  trackingNumber?: string;
  notes: {
    by: "admin" | "system" | "user";
    message: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const returnItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  reason: { type: String, required: true },
  condition: {
    type: String,
    enum: ["opened", "sealed", "damaged"],
    required: true
  },
  images: [{ type: String }],
}, { _id: false });

const returnNoteSchema = new Schema({
  by: { type: String, enum: ["admin", "system", "user"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const returnSchema = new Schema<IReturn>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [returnItemSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "received", "refunded", "cancelled"],
      default: "pending",
    },
    reason: { type: String, required: true },
    description: { type: String },
    refundAmount: { type: Number, required: true },
    refundMethod: {
      type: String,
      enum: ["original", "store_credit", "bank_transfer"],
      default: "original",
    },
    trackingNumber: { type: String },
    notes: [returnNoteSchema],
  },
  { timestamps: true }
);

returnSchema.index({ userId: 1 });
returnSchema.index({ orderId: 1 });
returnSchema.index({ status: 1 });

export const Return =
  mongoose.models.Return || mongoose.model<IReturn>("Return", returnSchema);
