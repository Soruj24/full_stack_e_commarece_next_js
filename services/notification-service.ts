import { Notification } from "@/context/NotificationContext";

export async function fetchNotifications(userId: string) {
  const response = await fetch(`/api/notifications?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  const data = await response.json();
  return data.notifications || [];
}

export async function markAsRead(id: string) {
  const response = await fetch(`/api/notifications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isRead: true }),
  });
  if (!response.ok) throw new Error("Failed to mark notification as read");
}

export async function markAllAsRead(userId: string) {
  const response = await fetch(`/api/notifications/mark-all-read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error("Failed to mark all notifications as read");
}

export async function deleteNotification(id: string) {
  const response = await fetch(`/api/notifications/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete notification");
}

export async function clearAll(userId: string) {
  const response = await fetch(`/api/notifications/clear-all`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error("Failed to clear notifications");
}
