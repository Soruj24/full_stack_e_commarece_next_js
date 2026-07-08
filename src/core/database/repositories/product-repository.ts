import { Product } from "@/core/database/models/Product";
import type { FilterQuery } from "mongoose";

export const ProductRepository = {
  async findById(id: string) {
    return Product.findById(id).populate("category");
  },

  async findBySlug(slug: string) {
    return Product.findOne({ slug }).populate("category");
  },

  async create(data: Record<string, unknown>) {
    return Product.create(data);
  },

  async updateById(id: string, data: Record<string, unknown>) {
    return Product.findByIdAndUpdate(id, { $set: data }, { new: true }).populate("category");
  },

  async deleteById(id: string) {
    return Product.findByIdAndDelete(id);
  },

  async findWithFilters(filter: FilterQuery<unknown> = {}, options: { sort?: Record<string, 1 | -1>; limit?: number; skip?: number } = {}) {
    return Product.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .populate("category");
  },

  async updateStock(id: string, quantity: number) {
    return Product.findByIdAndUpdate(id, { $inc: { stock: -quantity } }, { new: true });
  },

  async count(filter: FilterQuery<unknown> = {}) {
    return Product.countDocuments(filter);
  },

  async findFeatured() {
    return Product.find({ isFeatured: true, isArchived: false })
      .sort({ rating: -1 })
      .limit(10)
      .populate("category");
  },
};
