import mongoose, { Schema, Document } from "mongoose";

export interface IGiftCard extends Document {
  code: string;
  amount: number;
  remainingBalance: number;
  currency: string;
  purchasedBy?: mongoose.Types.ObjectId;
  purchasedAt?: Date;
  recipientName?: string;
  recipientEmail?: string;
  senderName: string;
  senderEmail: string;
  message?: string;
  isActive: boolean;
  expiresAt: Date;
  usedBy: mongoose.Types.ObjectId[];
  usedAt: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const giftCardSchema = new Schema<IGiftCard>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    amount: { type: Number, required: true, min: 1 },
    remainingBalance: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    purchasedBy: { type: Schema.Types.ObjectId, ref: "User" },
    purchasedAt: { type: Date },
    recipientName: { type: String },
    recipientEmail: { type: String },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    message: { type: String, maxlength: 500 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
    usedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    usedAt: [{ type: Date }],
  },
  { timestamps: true }
);

giftCardSchema.index({ code: 1 });
giftCardSchema.index({ purchasedBy: 1 });
giftCardSchema.index({ expiresAt: 1 });

export const GiftCard =
  mongoose.models.GiftCard || mongoose.model<IGiftCard>("GiftCard", giftCardSchema);
