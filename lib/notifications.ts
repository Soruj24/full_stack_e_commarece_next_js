import { dbConnect } from "@/config/db";
import { Notification, INotification } from "@/models/Notification";
import mongoose from "mongoose";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface CreateNotificationParams {
  userId: string | mongoose.Types.ObjectId;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<INotification | null> {
  try {
    await dbConnect();

    const notification = await Notification.create({
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      link: params.link,
      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

export async function createBulkNotifications(
  notifications: CreateNotificationParams[]
): Promise<number> {
  try {
    await dbConnect();

    const created = await Notification.insertMany(
      notifications.map((n) => ({
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type || "info",
        link: n.link,
        isRead: false,
      }))
    );

    return created.length;
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    return 0;
  }
}

export async function notifyOrderUpdate(
  userId: string | mongoose.Types.ObjectId,
  orderId: string,
  status: string,
  message: string
): Promise<INotification | null> {
  return createNotification({
    userId,
    title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message,
    type: status === "cancelled" || status === "refunded" ? "error" : "success",
    link: `/orders/${orderId}`,
  });
}

export async function notifyNewMessage(
  userId: string | mongoose.Types.ObjectId,
  senderName: string,
  message: string,
  chatId: string
): Promise<INotification | null> {
  return createNotification({
    userId,
    title: `New message from ${senderName}`,
    message: message.substring(0, 100),
    type: "info",
    link: `/chat/${chatId}`,
  });
}

export async function notifySecurityAlert(
  userId: string | mongoose.Types.ObjectId,
  alertType: string,
  details: string
): Promise<INotification | null> {
  return createNotification({
    userId,
    title: `Security Alert: ${alertType}`,
    message: details,
    type: "warning",
  });
}

export async function notifyPromotion(
  userId: string | mongoose.Types.ObjectId,
  title: string,
  description: string,
  promoLink?: string
): Promise<INotification | null> {
  return createNotification({
    userId,
    title,
    message: description,
    type: "success",
    link: promoLink,
  });
}
