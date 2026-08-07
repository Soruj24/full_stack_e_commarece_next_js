import type { User, ContactMessage, IAuditLog } from "@/shared/types";
import { csrfFetch } from "@/lib/security/csrf-client";

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  activeUsers: number;
  lowStockCount: number;
}

interface AdminSettings {
  siteName: string;
  contactEmail: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  logo: string;
  footerText: string;
  currency: string;
  googleAnalyticsId: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

export type { AdminStats, AdminSettings };

async function safeJson(res: Response) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/admin/users");
  const data = await safeJson(res);
  if (data.success) return data.users;
  return [];
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch("/api/contact");
  const data = await safeJson(res);
  if (Array.isArray(data)) return data;
  return [];
}

export async function fetchSettings(): Promise<AdminSettings | null> {
  const res = await fetch("/api/admin/settings");
  const data = await safeJson(res);
  if (data.success) return data.settings;
  return null;
}

export async function fetchAuditLogs(): Promise<IAuditLog[]> {
  const res = await fetch("/api/admin/audit-logs");
  const data = await safeJson(res);
  if (data.success) return data.logs;
  return [];
}

export async function fetchActivityData(): Promise<{ date: string; count: number }[]> {
  const res = await fetch("/api/admin/activity");
  const data = await safeJson(res);
  if (data.success) return data.data;
  return [];
}

export async function fetchAnalytics(): Promise<AdminStats | null> {
  const res = await fetch("/api/admin/analytics");
  const data = await safeJson(res);
  if (data.summary) {
    return {
      totalRevenue: data.summary.revenue,
      totalOrders: data.summary.orders,
      totalUsers: data.summary.users,
      totalProducts: data.summary.products,
      activeUsers: data.summary.activeUsers,
      lowStockCount: data.summary.lowStockCount,
    };
  }
  return null;
}

export async function deleteUser(userId: string): Promise<boolean> {
  const res = await csrfFetch("/api/admin/users", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.ok;
}

export async function changeUserRole(userId: string, role: string): Promise<boolean> {
  const res = await csrfFetch("/api/admin/users", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, role }),
  });
  return res.ok;
}

export async function updateUserStatus(userId: string, status: string): Promise<boolean> {
  const res = await csrfFetch("/api/admin/users", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, status }),
  });
  return res.ok;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const res = await csrfFetch(`/api/contact?id=${id}`, { method: "DELETE" });
  return res.ok;
}

export async function updateSettings(settings: AdminSettings): Promise<{ success: boolean; error?: string }> {
  const res = await csrfFetch("/api/admin/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  return safeJson(res);
}

export async function setup2FA(): Promise<{ qrCodeUrl: string; secret: string } | null> {
  const res = await csrfFetch("/api/auth/2fa/setup", { method: "POST" });
  const data = await safeJson(res);
  if (data.qrCodeUrl) return data;
  return null;
}

export async function verify2FA(token: string): Promise<{ success: boolean; error?: string }> {
  const res = await csrfFetch("/api/auth/2fa/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return safeJson(res);
}
