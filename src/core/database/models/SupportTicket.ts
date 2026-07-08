import mongoose, { Schema, Document } from "mongoose";

export interface ISupportTicket extends Document {
  userId?: mongoose.Types.ObjectId;
  email: string;
  name: string;
  subject: string;
  category: "order" | "product" | "billing" | "technical" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "pending" | "resolved" | "closed";
  messages: {
    sender: "user" | "support";
    message: string;
    attachments?: string[];
    createdAt: Date;
  }[];
  relatedOrderId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    category: {
      type: String,
      enum: ["order", "product", "billing", "technical", "other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "pending", "resolved", "closed"],
      default: "open",
    },
    messages: [
      {
        sender: { type: String, enum: ["user", "support"], required: true },
        message: { type: String, required: true },
        attachments: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    relatedOrderId: { type: Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

supportTicketSchema.index({ userId: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ category: 1 });

export const SupportTicket =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", supportTicketSchema);
