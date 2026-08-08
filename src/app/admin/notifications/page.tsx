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
      const json = await res.json();
      if (!res.ok) throw new Error("Failed to fetch notifications");
      if (!json.success) throw new Error(json.error || "Failed to fetch notifications");
      const raw = json.data?.notifications || json.notifications || [];
      const mapped: AdminNotification[] = raw.map((n: Record<string, unknown>) => ({
        _id: (n.id as string) || "",
        title: (n.title as string) || "",
        message: (n.message as string) || "",
        type: (n.severity as string) || (n.type as string) || "info",
        recipients: "all" as const,
        recipientIds: [],
        status: (n.isRead as boolean) ? "sent" : "scheduled",
        scheduledFor: undefined,
        sentAt: (n.createdAt as string) || undefined,
        readBy: [],
        createdAt: (n.createdAt as string) || new Date().toISOString(),
        updatedAt: (n.createdAt as string) || new Date().toISOString(),
      }));
      setNotifications(mapped);
      setStats({
        total: json.data?.totalCount || mapped.length,
        sent: mapped.filter((n) => n.status === "sent").length,
        scheduled: mapped.filter((n) => n.status === "scheduled").length,
        failed: mapped.filter((n) => n.status === "failed").length,
      });
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
      const res = await fetch("/api/admin/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete notification");
      toast.success("Notification deleted");
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
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
