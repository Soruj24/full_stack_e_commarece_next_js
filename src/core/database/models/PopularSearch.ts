import mongoose, { Schema, Document } from "mongoose";

export interface IPopularSearch extends Document {
  query: string;
  normalizedQuery: string;
  count: number;
  lastSearchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const popularSearchSchema = new Schema<IPopularSearch>(
  {
    query: { type: String, required: true },
    normalizedQuery: { type: String, required: true, lowercase: true },
    count: { type: Number, default: 1 },
    lastSearchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

popularSearchSchema.index({ normalizedQuery: 1 }, { unique: true });
popularSearchSchema.index({ count: -1 });
popularSearchSchema.index({ lastSearchedAt: -1 });

export const PopularSearch =
  mongoose.models.PopularSearch ||
  mongoose.model<IPopularSearch>("PopularSearch", popularSearchSchema);
