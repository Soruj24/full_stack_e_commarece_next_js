"use client";

import { motion } from "framer-motion";
import {
  Check, Circle, Clock, MapPin, Package, Truck, Home, CreditCard, ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface TimelineEvent {
  id: string;
  status: string;
  title: string;
  description?: string;
  location?: string;
  timestamp: string | Date;
  icon?: React.ReactNode;
}

interface OrderTimelineTrackerProps {
  events: TimelineEvent[];
  currentStatus?: string;
  estimatedDelivery?: string;
  className?: string;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  confirmed: <ClipboardCheck className="w-4 h-4" />,
  processing: <Package className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  out_for_delivery: <MapPin className="w-4 h-4" />,
  delivered: <Home className="w-4 h-4" />,
  paid: <CreditCard className="w-4 h-4" />,
};

const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

const STATUS_STYLES = {
  completed: { dot: "bg-green-500", line: "bg-green-500", iconBg: "bg-green-500", iconColor: "text-white", text: "text-foreground", desc: "text-muted-foreground" },
  current: { dot: "bg-primary ring-4 ring-primary/20", line: "bg-zinc-200 dark:bg-zinc-700", iconBg: "bg-primary", iconColor: "text-primary-foreground", text: "text-foreground font-semibold", desc: "text-muted-foreground" },
  upcoming: { dot: "bg-zinc-300 dark:bg-zinc-600", line: "bg-zinc-200 dark:bg-zinc-700", iconBg: "bg-zinc-100 dark:bg-zinc-800", iconColor: "text-muted-foreground", text: "text-muted-foreground", desc: "text-muted-foreground/60" },
};

function getEventStatus(event: TimelineEvent, index: number, events: TimelineEvent[], currentStatus?: string) {
  if (index === 0 && events.length > 1) return "completed";
  if (index === events.length - 1) return currentStatus === event.status ? "current" : "upcoming";
  if (currentStatus && STATUS_ORDER.indexOf(currentStatus) > STATUS_ORDER.indexOf(event.status)) return "completed";
  if (currentStatus === event.status) return "current";
  return "upcoming";
}

export function OrderTimelineTracker({ events, currentStatus, estimatedDelivery, className }: OrderTimelineTrackerProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="relative">
        {events.map((event, index) => {
          const status = getEventStatus(event, index, events, currentStatus);
          const styles = STATUS_STYLES[status];
          const isLast = index === events.length - 1;

          return (
            <div key={event.id} className="relative flex gap-4">
              {!isLast && <div className={cn("absolute left-[19px] top-10 bottom-0 w-0.5", styles.line)} />}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn("relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0", styles.iconBg)}
              >
                {status === "completed" ? (
                  <Check className={cn("w-5 h-5", styles.iconColor)} />
                ) : (
                  <span className={styles.iconColor}>
                    {event.icon || STATUS_ICONS[event.status.toLowerCase()] || <Circle className="w-4 h-4" />}
                  </span>
                )}
              </motion.div>
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className={cn("text-sm", styles.text)}>{event.title}</h4>
                    {event.description && <p className={cn("text-xs mt-0.5", styles.desc)}>{event.description}</p>}
                    {event.location && (
                      <p className={cn("text-xs mt-1", styles.desc)}>
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {event.location}
                      </p>
                    )}
                  </div>
                  <time className={cn("text-xs shrink-0", styles.desc)}>
                    {format(new Date(event.timestamp), "MMM d, h:mm a")}
                  </time>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {estimatedDelivery && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Delivery</p>
              <p className="font-semibold">{estimatedDelivery}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
