import mongoose, { Schema, Document } from "mongoose";

export interface IPayout extends Document {
  vendorId: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  paymentMethod: "bank_transfer" | "paypal" | "stripe";
  transactionId?: string;
  notes?: string;
  processedAt?: Date;
  requestedAt: Date;
  completedAt?: Date;
}

const payoutSchema = new Schema<IPayout>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "paypal", "stripe"],
      required: true,
    },
    transactionId: { type: String },
    notes: { type: String },
    processedAt: { type: Date },
    requestedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

payoutSchema.index({ vendorId: 1, status: 1 });

export const Payout =
  mongoose.models.Payout || mongoose.model<IPayout>("Payout", payoutSchema);
