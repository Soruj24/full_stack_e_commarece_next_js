import { apiClient } from "@/shared/services/api-client";

export const CartService = {
  async recoverAbandonedCart(email: string) {
    return apiClient.get<{ success: boolean; cart?: unknown }>(`/api/abandoned-carts?email=${email}`);
  },
  
  async saveCart(items: unknown[]) {
    return apiClient.post("/api/abandoned-carts", { items });
  },
};
