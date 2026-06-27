"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import * as NotificationService from "@/features/notifications/services/notification-service";
import { useNotificationSocket } from "@/features/notifications/hooks/use-notification-socket";

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
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSocketNotification = useCallback((data: Notification) => {
    setNotifications((prev) => [data, ...prev]);
    const toastOptions = {
      duration: 5000,
      action: data.link ? { label: "View", onClick: () => window.location.href = data.link! } : undefined,
    };
    switch (data.type) {
      case "success": toast.success(data.title, { description: data.message, ...toastOptions }); break;
      case "error": toast.error(data.title, { description: data.message, ...toastOptions }); break;
      case "warning": toast.warning(data.title, { description: data.message, ...toastOptions }); break;
      default: toast.info(data.title, { description: data.message, ...toastOptions });
    }
  }, []);

  const isConnected = useNotificationSocket(userId, handleSocketNotification);

  const fetchNotifications = useCallback(async () => {
    if (!userId) { setIsLoading(false); return; }
    try {
      const notifs = await NotificationService.fetchNotifications(userId);
      setNotifications(notifs);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) { setIsLoading(false); return; }
    fetchNotifications();
  }, [userId, fetchNotifications]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const clearAll = async () => {
    try {
      await NotificationService.clearAll(userId);
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
  };

  const refreshNotifications = async () => {
    setIsLoading(true);
    await fetchNotifications();
  };

  return (
    <NotificationContext.Provider value={{notifications, unreadCount, isLoading, isConnected,
      addNotification, markAsRead, markAllAsRead, deleteNotification, clearAll, refreshNotifications}}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: [], unreadCount: 0, isLoading: false, isConnected: false,
      addNotification: () => {}, markAsRead: async () => {},
      markAllAsRead: async () => {}, deleteNotification: async () => {},
      clearAll: async () => {}, refreshNotifications: async () => {},
    };
  }
  return context;
};