import { Server } from "socket.io";
import { dbConnect } from "@/core/config/database";
import { getEnv } from "@/core/config/env";
import { getUnreadNotifications, createNotification } from "../services/notification-service";

export function setupNotificationHandlers(io: Server) {
  io.on("connection", (socket) => {
    // TODO: Remove console.log or replace with proper logging
    console.log("Client connected:", socket.id);

    socket.on("join", async (userId: string) => {
      // TODO: Remove console.log or replace with proper logging
      console.log(`User ${userId} joined`);
      socket.join(userId);

      try {
        await dbConnect();

        const unreadNotifications = await getUnreadNotifications(userId);

        unreadNotifications.forEach((notification) => {
          socket.emit("notification", {
            id: notification._id.toString(),
            title: notification.title,
            message: notification.message,
            type: notification.type,
            link: notification.link,
            createdAt: notification.createdAt.toISOString(),
          });
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    });

    socket.on("leave", (userId: string) => {
      // TODO: Remove console.log or replace with proper logging
      console.log(`User ${userId} left`);
      socket.leave(userId);
    });

    socket.on("sendNotification", async (data) => {
      try {
        const notification = await createNotification({
          userId: data.userId,
          title: data.title,
          message: data.message,
          type: data.type || "info",
          link: data.link,
        });

        io.to(data.userId).emit("notification", {
          id: notification._id.toString(),
          title: notification.title,
          message: notification.message,
          type: notification.type,
          link: notification.link,
          createdAt: notification.createdAt.toISOString(),
        });
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });

    socket.on("disconnect", () => {
      // TODO: Remove console.log or replace with proper logging
      console.log("Client disconnected:", socket.id);
    });
  });
}
