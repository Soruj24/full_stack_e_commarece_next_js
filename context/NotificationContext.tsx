"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isConnected: boolean;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ 
  children, 
  userId 
}: { 
  children: React.ReactNode; 
  userId: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    let newSocket: Socket | null = null;

    const initializeNotifications = async () => {
      try {
        await fetchNotifications();
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    initializeNotifications();

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

      newSocket.on("notification", (data: Notification) => {
        setNotifications((prev) => [data, ...prev]);
        
        const toastOptions = {
          duration: 5000,
          action: data.link ? {
            label: "View",
            onClick: () => window.location.href = data.link!,
          } : undefined,
        };

        switch (data.type) {
          case "success":
            toast.success(data.title, { description: data.message, ...toastOptions });
            break;
          case "error":
            toast.error(data.title, { description: data.message, ...toastOptions });
            break;
          case "warning":
            toast.warning(data.title, { description: data.message, ...toastOptions });
            break;
          default:
            toast.info(data.title, { description: data.message, ...toastOptions });
        }
      });

      newSocket.on("orderUpdate", (data: { orderId: string; status: string; message: string }) => {
        toast.info(`Order Update`, { description: data.message, duration: 5000 });
      });

      setSocket(newSocket);
    } catch (socketError) {
      console.error("Socket connection error:", socketError);
    }

    return () => {
      if (newSocket) {
        newSocket.emit("leave", userId);
        newSocket.disconnect();
      }
    };
  }, [userId, fetchNotifications]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`/api/notifications/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        toast.success("Notification deleted");
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const clearAll = async () => {
    try {
      const response = await fetch(`/api/notifications/clear-all`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setNotifications([]);
        toast.success("All notifications cleared");
      }
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
  };

  const refreshNotifications = async () => {
    setIsLoading(true);
    await fetchNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        isConnected,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    return {
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      isConnected: false,
      addNotification: () => {},
      markAsRead: async () => {},
      markAllAsRead: async () => {},
      deleteNotification: async () => {},
      clearAll: async () => {},
      refreshNotifications: async () => {},
    };
  }
  
  return context;
};
