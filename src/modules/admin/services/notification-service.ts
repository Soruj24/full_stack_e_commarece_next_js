import type { AdminNotification, NotificationTemplate, NotificationFormData } from "@/modules/admin/types/analytics";

interface NotificationFilters {
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

function buildNotificationQuery(filters?: NotificationFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchNotifications(filters?: NotificationFilters): Promise<AdminNotification[]> {
  try {
    const query = buildNotificationQuery(filters);
    const res = await fetch(`/api/admin/notifications${query}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.notifications)) return data.notifications;
    return [];
  } catch {
    return [];
  }
}

export async function createNotification(data: NotificationFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function deleteNotification(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/notifications?id=${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchNotificationTemplates(): Promise<NotificationTemplate[]> {
  try {
    const res = await fetch("/api/admin/notifications/templates");
    const data = await res.json();
    if (data.success && Array.isArray(data.templates)) return data.templates;
    return [];
  } catch {
    return [];
  }
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/notifications/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
