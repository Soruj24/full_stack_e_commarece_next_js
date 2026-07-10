"use client";

import { Bell, Wifi, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/modules/notifications/context/NotificationContext";

export function NotificationDropdown() {
  const {
    notifications, unreadCount,
    markAsRead: markRead, markAllAsRead: markAllRead,
    isConnected,
  } = useNotifications();
  const router = useRouter();

  const handleRead = async (id: string, link?: string) => {
    await markRead(id);
    if (link) router.push(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/60 transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="w-[20px] h-[20px] text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[9px] font-semibold text-primary-foreground flex items-center justify-center ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(360px,calc(100vw-32px))] p-0 rounded-xl shadow-xl border-border/40 overflow-hidden mt-2">
        <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-semibold text-foreground">Notifications</h3>
            {isConnected ? <Wifi className="w-3 h-3 text-emerald-500" /> : <WifiOff className="w-3 h-3 text-muted-foreground/30" />}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}
              className="text-[11px] font-medium text-primary hover:text-primary/80 h-6 px-2 rounded-md">
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n._id} onClick={() => handleRead(n._id, n.link)}
                className={cn(
                  "px-4 py-3 border-b border-border/20 last:border-0 cursor-pointer transition-colors hover:bg-muted/30",
                  !n.isRead && "bg-primary/[0.02]",
                )}>
                <div className="flex gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    n.type === "success" ? "bg-emerald-500/10 text-emerald-500" :
                    n.type === "warning" ? "bg-amber-500/10 text-amber-500" :
                    n.type === "error" ? "bg-red-500/10 text-red-500" :
                    "bg-primary/10 text-primary",
                  )}>
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-[12px] leading-snug", !n.isRead ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>
                      {n.title || "Notification"}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 line-clamp-2 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/35 mt-1 font-medium">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                <Bell className="w-4 h-4 text-muted-foreground/30" />
              </div>
              <p className="text-[12px] text-muted-foreground/40 font-medium">No notifications</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
