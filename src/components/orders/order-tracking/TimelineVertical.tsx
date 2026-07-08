"use client";

import { motion } from "framer-motion";
import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusIcons, statusColors } from "@/lib/data/order-tracking";
import { format } from "date-fns";
import type { TrackingEvent } from "@/modules/orders/context/OrderTrackingContext";

interface TimelineVerticalProps {
  events: TrackingEvent[];
  showTimestamps?: boolean;
}

export function TimelineVertical({ events, showTimestamps = true }: TimelineVerticalProps) {
  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const Icon = statusIcons[event.status];
        const colorClass = statusColors[event.status];
        const isLast = index === events.length - 1;

        return (
          <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all relative z-10",
                colorClass, event.isCompleted && "bg-current text-white",
                event.isCurrent && "ring-4 ring-primary/20 animate-pulse"
              )}>
                {event.isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              {!isLast && (
                <div className={cn("w-0.5 h-16 transition-colors", events[index + 1]?.isCompleted ? "bg-primary" : "bg-muted")} />
              )}
            </div>
            <div className={cn("flex-1 pb-8", !event.isCompleted && !event.isCurrent && "opacity-50")}>
              <h4 className={cn("font-semibold text-lg", (event.isCompleted || event.isCurrent) && "text-foreground")}>
                {event.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
              {event.location && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{event.location}
                </p>
              )}
              {showTimestamps && (
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(event.timestamp), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
