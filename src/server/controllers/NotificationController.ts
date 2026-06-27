import { Server } from "socket.io";
import mongoose from "mongoose";
import { Notification } from "@/lib/mongodb/models/Notification";

export function setupNotificationHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join", async (userId: string) => {
      console.log(`User ${userId} joined`);
      socket.join(userId);

      try {
        await mongoose.connect(
          process.env.MONGODB_URI ||
            "mongodb://soruj426:LsMtyBV6BzXN5EPt@cluster0.zqopcm7.mongodb.net/full_stack_e_commerce_next_js?retryWrites=true&w=majority"
        );

        const unreadNotifications = await Notification.find({
          userId,
          isRead: false,
        })
          .sort({ createdAt: -1 })
          .limit(10);

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
      console.log(`User ${userId} left`);
      socket.leave(userId);
    });

    socket.on("sendNotification", async (data) => {
      try {
        const notification = await Notification.create({
          userId: data.userId,
          title: data.title,
          message: data.message,
          type: data.type || "info",
          link: data.link,
          isRead: false,
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
      console.log("Client disconnected:", socket.id);
    });
  });
}