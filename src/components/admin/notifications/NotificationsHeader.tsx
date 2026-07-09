"use client";

import { RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationsHeaderProps {
  onSend: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function NotificationsHeader({
  onSend,
  onRefresh,
  loading,
}: NotificationsHeaderProps) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Notifications
        </h1>
        <p className="text-muted-foreground">
          Manage and send notifications to users.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={onSend} className="rounded-2xl font-bold gap-2">
          <Send className="w-4 h-4" />
          Send Notification
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-2xl"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
