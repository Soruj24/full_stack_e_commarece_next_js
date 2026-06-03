"use client";

import { Bell, Wifi, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/context/NotificationContext";

export function NotificationDropdown() {
  const {
    notifications: contextNotifications,
    unreadCount,
    markAsRead: markAsReadContext,
    markAllAsRead: markAllAsReadContext,
    isConnected,
  } = useNotifications();
  const router = useRouter();

  const markAsRead = async (id: string, link?: string) => {
    await markAsReadContext(id);
    if (link) {
      router.push(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-primary/10 hover:text-primary transition-all bg-muted/30 md:bg-transparent h-9 w-9 sm:h-10 sm:w-10"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-primary text-[7px] sm:text-[8px] font-black text-primary-foreground flex items-center justify-center ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-32px)] sm:w-80 p-0 rounded-[24px] shadow-2xl border-border/40 overflow-hidden mt-2"
      >
        <div className="p-5 border-b border-border/40 bg-muted/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Notifications
            </h3>
            {isConnected ? (
              <Wifi className="w-3 h-3 text-green-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsReadContext}
              className="text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 h-7 px-3 rounded-full"
            >
              Clear All
            </Button>
          )}
        </div>
        <div className="max-h-[380px] overflow-y-auto">
          {contextNotifications.length > 0 ? (
            contextNotifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id, n.link)}
                className={cn(
                  "p-5 border-b border-border/40 last:border-0 cursor-pointer transition-all hover:bg-primary/[0.02]",
                  !n.isRead ? "bg-primary/[0.03]" : "opacity-70",
                )}
              >
                <div className="flex gap-4">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      n.type === "success"
                        ? "bg-green-500/10 text-green-500"
                        : n.type === "warning"
                          ? "bg-amber-500/10 text-amber-500"
                          : n.type === "error"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-primary/10 text-primary",
                    )}
                  >
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "text-xs leading-tight",
                        !n.isRead
                          ? "font-black text-foreground"
                          : "font-medium text-muted-foreground",
                      )}
                    >
                      {n.title || "Notification"}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed font-medium">
                      {n.message}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-2">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-muted mx-auto flex items-center justify-center">
                <Bell className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">
                All caught up
              </p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
