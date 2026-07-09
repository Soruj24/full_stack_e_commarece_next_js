"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  NotificationsHeader,
  NotificationStats,
  NotificationList,
  SendNotificationDialog,
} from "@/components/admin/notifications";
import type { AdminNotification } from "@/modules/admin/types";

interface NotificationsResponse {
  notifications: AdminNotification[];
  stats: {
    total: number;
    sent: number;
    scheduled: number;
    failed: number;
  };
}

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [stats, setStats] = useState({ total: 0, sent: 0, scheduled: 0, failed: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const json: NotificationsResponse = await res.json();
      if (!res.ok) throw new Error("Failed to fetch notifications");
      setNotifications(json.notifications || []);
      setStats(json.stats || { total: 0, sent: 0, scheduled: 0, failed: 0 });
    } catch {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete notification");
      toast.success("Notification deleted successfully");
      fetchNotifications();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete notification");
      }
    }
  }, [fetchNotifications]);

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <NotificationsHeader
        onSend={() => setDialogOpen(true)}
        onRefresh={fetchNotifications}
        loading={loading}
      />

      <NotificationStats stats={stats} />

      <NotificationList
        notifications={notifications}
        onDelete={handleDelete}
        loading={loading}
      />

      <SendNotificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchNotifications}
      />
    </div>
  );
}
