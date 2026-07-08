import { apiClient } from "@/shared/services/api-client";
import type { ApiResponse } from "@/shared/types/api";
import type { ProductFilters } from "../types";

const BASE = "/api/products";

export async function fetchProduct(id: string) {
  const res = await fetch(`${BASE}/${id}`);
  const data = await res.json();
  if (data.success) return data.product;
  throw new Error(data.error || "Failed to fetch product");
}

export const ProductService = {
  async list(filters?: ProductFilters) {
    const params: Record<string, string> = {};
    if (filters) {
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minPrice) params.minPrice = String(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = String(filters.maxPrice);
      if (filters.rating) params.rating = String(filters.rating);
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.page) params.page = String(filters.page);
      if (filters.limit) params.limit = String(filters.limit);
      if (filters.keyword) params.keyword = filters.keyword;
    }
    return apiClient.get<ApiResponse & { products: unknown[]; pagination: unknown }>("/api/products", params);
  },

  async getById(id: string) {
    return apiClient.get<ApiResponse & { product: unknown }>(`/api/products/${id}`);
  },

  async create(data: Record<string, unknown>) {
    return apiClient.post<ApiResponse & { product: unknown }>("/api/products", data);
  },

  async update(id: string, data: Record<string, unknown>) {
    return apiClient.patch<ApiResponse & { product: unknown }>(`/api/products/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete<ApiResponse>(`/api/products/${id}`);
  },

  async search(query: string) {
    return apiClient.get<ApiResponse & { suggestions: unknown }>(`/api/products/search?q=${query}`);
  },

  async getRecommendations() {
    return apiClient.get<unknown[]>("/api/products/recommendations");
  },

  async getLowStock() {
    return apiClient.get("/api/products/low-stock");
  },
};
