import { apiClient } from "@/shared/services/api-client";
import type { ApiResponse } from "@/shared/types/api";

export interface OrderData {
  items: { product: string; name: string; quantity: number; price: number; image: string }[];
  shippingAddress: Record<string, string>;
  paymentMethod: string;
  paymentIntentId?: string;
  transactionId?: string;
  paymentPhoneNumber?: string;
  shippingPrice?: number;
  shippingCarrier?: string;
  shippingService?: string;
  taxPrice?: number;
  totalAmount: number;
  currency?: string;
  couponCode?: string;
  discount?: number;
}

export const OrderService = {
  async create(data: OrderData) {
    return apiClient.post<ApiResponse & { order: Record<string, unknown> }>("/api/orders", data);
  },

  async createGuest(data: OrderData & { email: string }) {
    return apiClient.post<ApiResponse & { order: Record<string, unknown> }>("/api/orders/guest", data);
  },

  async list(params?: { page?: number; limit?: number; status?: string }) {
    return apiClient.get<ApiResponse & { orders: unknown[]; pagination: unknown }>("/api/orders", params as Record<string, string>);
  },

  async getById(id: string) {
    return apiClient.get<ApiResponse & { order: Record<string, unknown> }>(`/api/orders/${id}`);
  },

  async trackOrder(id: string) {
    return apiClient.get<ApiResponse & { tracking: unknown }>(`/api/orders/${id}/tracking`);
  },
};
