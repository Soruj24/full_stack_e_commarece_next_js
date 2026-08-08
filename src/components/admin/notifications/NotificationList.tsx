"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, AlertTriangle, CheckCircle, XCircle, Trash2, Users, Shield, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { AdminNotification } from "@/modules/admin/types";

interface NotificationListProps {
  notifications: AdminNotification[];
  onDelete: (id: string) => void;
  loading: boolean;
}

function getTypeIcon(type: string) {
  switch (type) {
    case "info": return <Info className="h-3.5 w-3.5 text-blue-500" />;
    case "warning": return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
    case "success": return <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />;
    case "error": return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    case "critical": return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    default: return <Info className="h-3.5 w-3.5 text-muted-foreground" />;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "sent": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "scheduled": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "draft": return "bg-muted text-muted-foreground border-border/60";
    case "failed": return "bg-red-500/10 text-red-600 border-red-500/20";
    default: return "bg-muted text-muted-foreground border-border/60";
  }
}

function getRecipientsIcon(recipients: string) {
  switch (recipients) {
    case "all": return <Users className="h-3.5 w-3.5" />;
    case "admin": return <Shield className="h-3.5 w-3.5" />;
    case "user": return <User className="h-3.5 w-3.5" />;
    default: return <Users className="h-3.5 w-3.5" />;
  }
}

export function NotificationList({ notifications, onDelete, loading }: NotificationListProps) {
  if (loading) {
    return (
      <div className="border border-border/60 rounded-xl bg-card p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto" />
        <p className="text-sm text-muted-foreground mt-4">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="border border-border/60 rounded-xl bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No notifications found</p>
      </div>
    );
  }

  return (
    <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification._id}>
                <TableCell className="text-sm font-medium">{notification.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {notification.message}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded-md bg-muted/50">
                      {getTypeIcon(notification.type)}
                    </div>
                    <span className="text-xs font-medium capitalize">{notification.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getRecipientsIcon(notification.recipients)}
                    <span className="text-xs font-medium capitalize">{notification.recipients}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[11px] font-medium ${getStatusBadge(notification.status)}`}>
                    {notification.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {notification.sentAt ? formatDate(notification.sentAt) : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => onDelete(notification._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
