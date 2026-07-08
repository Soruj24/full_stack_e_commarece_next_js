import { Notification } from "@/core/database/models/Notification";

export async function getUnreadNotifications(userId: string) {
  return Notification.find({ userId, isRead: false })
    .sort({ createdAt: -1 })
    .limit(10);
}

export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  return Notification.create({
    userId: data.userId,
    title: data.title,
    message: data.message,
    type: data.type || "info",
    link: data.link,
    isRead: false,
  });
}
