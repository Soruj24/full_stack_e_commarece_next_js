import { apiClient } from "@/shared/services/api-client";
import type { ApiResponse, LoginResponse, RegisterResponse } from "@/shared/types/api";

export const AuthService = {
  async login(email: string, password: string, otp?: string) {
    return apiClient.post<LoginResponse>("/api/auth/login", { email, password, otp });
  },

  async register(data: { name: string; email: string; password: string; referralCode?: string }) {
    return apiClient.post<RegisterResponse & { email?: string }>("/api/register", data);
  },

  async logout() {
    return apiClient.post<ApiResponse>("/api/auth/logout");
  },

  async verifyEmail(token: string) {
    return apiClient.get<ApiResponse>(`/api/auth/verify-email?token=${token}`);
  },

  async forgotPassword(email: string) {
    return apiClient.post<ApiResponse>("/api/forgot-password", { email });
  },

  async resetPassword(token: string, password: string) {
    return apiClient.post<ApiResponse>("/api/auth/reset-password", { token, password });
  },
};
