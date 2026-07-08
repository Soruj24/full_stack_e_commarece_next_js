import mongoose, { Schema, Document } from "mongoose";

export interface IFaq extends Document {
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFaqCategory extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  createdAt: Date;
}

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

faqSchema.index({ category: 1, order: 1 });
faqSchema.index({ isPublished: 1 });

const faqCategorySchema = new Schema<IFaqCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Faq = mongoose.models.Faq || mongoose.model<IFaq>("Faq", faqSchema);
export const FaqCategory = mongoose.models.FaqCategory || mongoose.model<IFaqCategory>("FaqCategory", faqCategorySchema);
