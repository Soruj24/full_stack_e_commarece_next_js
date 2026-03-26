import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { Notification } from "./models/Notification";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

interface UserToServerEvents {
  join: (userId: string) => void;
  leave: (userId: string) => void;
  sendNotification: (data: {
    userId: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    link?: string;
  }) => void;
}

interface ServerToUserEvents {
  notification: (data: {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    link?: string;
    createdAt: string;
  }) => void;
  orderUpdate: (data: {
    orderId: string;
    status: string;
    message: string;
  }) => void;
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", async (userId: string) => {
    console.log(`User ${userId} joined`);
    socket.join(userId);
    
    try {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/my-app");
      
      const unreadNotifications = await Notification.find({
        userId,
        isRead: false,
      }).sort({ createdAt: -1 }).limit(10);

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

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});

export { io };
