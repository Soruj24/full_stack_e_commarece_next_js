import mongoose, { Schema, Document } from "mongoose";

export interface ILoginHistory extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  ipAddress: string;
  userAgent: string;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  success: boolean;
  reason?: string;
  sessionId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LoginHistorySchema = new Schema<ILoginHistory>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, default: "" },
    device: { type: String },
    browser: { type: String },
    os: { type: String },
    location: { type: String },
    success: { type: Boolean, required: true },
    reason: { type: String },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

LoginHistorySchema.index({ userId: 1, createdAt: -1 });
LoginHistorySchema.index({ email: 1, createdAt: -1 });
LoginHistorySchema.index({ sessionId: 1 });

export default mongoose.models.LoginHistory ||
  mongoose.model<ILoginHistory>("LoginHistory", LoginHistorySchema);
