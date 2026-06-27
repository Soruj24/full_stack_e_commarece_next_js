"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { Notification } from "@/features/notifications/context/NotificationContext";

export function useNotificationSocket(
  userId: string,
  onNotification: (data: Notification) => void,
) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let newSocket: Socket | null = null;

    try {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
      newSocket = io(socketUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        newSocket?.emit("join", userId);
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      newSocket.on("notification", onNotification);

      newSocket.on("orderUpdate", (data: { orderId: string; status: string; message: string }) => {
        toast.info("Order Update", { description: data.message, duration: 5000 });
      });
    } catch (socketError) {
      console.error("Socket connection error:", socketError);
    }

    return () => {
      if (newSocket) {
        newSocket.emit("leave", userId);
        newSocket.disconnect();
      }
    };
  }, [userId, onNotification]);

  return isConnected;
}
