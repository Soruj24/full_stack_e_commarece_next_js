import mongoose, { Schema, Document } from "mongoose";

export interface IPriceHistory extends Document {
  productId: mongoose.Types.ObjectId;
  pricePoints: {
    date: Date;
    price: number;
    source?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const pricePointSchema = new Schema(
  {
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    source: { type: String },
  },
  { _id: false }
);

const priceHistorySchema = new Schema<IPriceHistory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    pricePoints: [pricePointSchema],
  },
  { timestamps: true }
);

priceHistorySchema.index({ productId: 1 });
priceHistorySchema.index({ "pricePoints.date": -1 });

export const PriceHistory =
  mongoose.models.PriceHistory ||
  mongoose.model<IPriceHistory>("PriceHistory", priceHistorySchema);
