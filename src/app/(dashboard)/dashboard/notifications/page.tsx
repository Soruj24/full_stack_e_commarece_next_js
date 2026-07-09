"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  Package,
  Gift,
  AlertTriangle,
  CreditCard,
  Truck,
  MessageCircle,
  CheckCheck,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ICON_MAP: Record<string, React.ReactNode> = {
  shopping: <ShoppingBag className="h-5 w-5" />,
  package: <Package className="h-5 w-5" />,
  gift: <Gift className="h-5 w-5" />,
  alert: <AlertTriangle className="h-5 w-5" />,
  payment: <CreditCard className="h-5 w-5" />,
  shipping: <Truck className="h-5 w-5" />,
  message: <MessageCircle className="h-5 w-5" />,
};

const ICON_BG: Record<string, string> = {
  shopping: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  package: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  gift: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  alert: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  payment: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  shipping: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  message: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
};

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "shopping", title: "Order Confirmed", message: "Your order #ORD-7892 has been confirmed and is being processed.", time: "2 min ago", read: false },
  { id: 2, type: "shipping", title: "Item Shipped", message: "Your package from Order #ORD-7892 has been shipped.", time: "15 min ago", read: false },
  { id: 3, type: "payment", title: "Payment Successful", message: "Your payment of $129.99 for Order #ORD-7891 was successful.", time: "1 hour ago", read: false },
  { id: 4, type: "gift", title: "Gift Card Received", message: "You received a $50 gift card from Jane!", time: "3 hours ago", read: true },
  { id: 5, type: "package", title: "Delivery Scheduled", message: "Your Order #ORD-7889 is scheduled for delivery tomorrow.", time: "5 hours ago", read: false },
  { id: 6, type: "alert", title: "Low Stock Alert", message: "The item 'Wireless Headphones' is almost out of stock.", time: "1 day ago", read: true },
  { id: 7, type: "message", title: "New Support Message", message: "Your support ticket #TK-451 has a new reply from our team.", time: "2 days ago", read: true },
  { id: 8, type: "shopping", title: "Back in Stock", message: "The item 'Premium Mouse Pad' is back in stock!", time: "3 days ago", read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "all" ? notifications : notifications.filter((n) => !n.read);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-background/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your latest activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
              <CheckCheck className="h-4 w-4" />
              Mark all as read ({unreadCount})
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </Button>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-16 text-center">
                <div className="rounded-full bg-muted/50 p-6 mb-4">
                  <Inbox className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No notifications</h3>
                <p className="text-muted-foreground text-sm">
                  {filter === "unread" ? "You're all caught up!" : "You have no notifications yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  onClick={() => markAsRead(notif.id)}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer",
                    notif.read
                      ? "bg-background border-border/50"
                      : "bg-primary/5 border-primary/20"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-full p-2.5 shrink-0",
                      ICON_BG[notif.type] || "bg-gray-100 text-gray-600"
                    )}
                  >
                    {ICON_MAP[notif.type] || <Bell className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={cn(
                          "text-sm",
                          notif.read ? "font-medium" : "font-semibold"
                        )}
                      >
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-xs text-muted-foreground mt-1.5 block">
                      {notif.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
