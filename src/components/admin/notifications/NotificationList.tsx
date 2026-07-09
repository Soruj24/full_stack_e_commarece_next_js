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

export function NotificationList({ notifications, onDelete, loading }: NotificationListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "scheduled":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getRecipientsIcon = (recipients: string) => {
    switch (recipients) {
      case "all":
        return <Users className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-[48px] p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-[48px] p-12 text-center">
        <p className="text-muted-foreground">No notifications found</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
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
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification._id}>
                <TableCell className="font-bold">{notification.title}</TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">
                  {notification.message}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-muted">
                      {getTypeIcon(notification.type)}
                    </div>
                    <span className="text-xs font-bold capitalize">{notification.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRecipientsIcon(notification.recipients)}
                    <span className="text-xs font-bold capitalize">{notification.recipients}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadge(notification.status)}>
                    {notification.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {notification.sentAt ? formatDate(notification.sentAt) : "N/A"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-destructive hover:text-destructive"
                    onClick={() => onDelete(notification._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
