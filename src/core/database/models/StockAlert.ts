import mongoose, { Schema, Document } from "mongoose";

export interface IStockAlert extends Document {
  productId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  email: string;
  type: "low_stock" | "back_in_stock";
  status: "pending" | "sent" | "expired";
  sentAt?: Date;
  createdAt: Date;
}

const stockAlertSchema = new Schema<IStockAlert>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    type: {
      type: String,
      enum: ["low_stock", "back_in_stock"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "expired"],
      default: "pending",
    },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

stockAlertSchema.index({ productId: 1, email: 1 }, { unique: true });
stockAlertSchema.index({ type: 1, status: 1 });

export const StockAlert =
  mongoose.models.StockAlert || mongoose.model<IStockAlert>("StockAlert", stockAlertSchema);
