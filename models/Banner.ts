import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    type: {
      type: String,
      enum: ["promotion", "announcement", "hero"],
      default: "promotion",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
