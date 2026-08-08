"use client";

import { RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/ui/PageHeader";

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
    <PageHeader
      title="Notifications"
      description="Manage and send notifications to users."
      action={
        <div className="flex items-center gap-3">
          <Button onClick={onSend} className="gap-2">
            <Send className="w-4 h-4" />
            Send Notification
          </Button>
          <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      }
    />
  );
}
