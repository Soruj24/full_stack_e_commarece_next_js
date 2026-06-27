"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusIcons, statusColors } from "@/lib/data/order-tracking";
import { formatDistanceToNow } from "date-fns";
import type { TrackingEvent } from "@/features/orders/context/OrderTrackingContext";

interface TimelineHorizontalProps {
  events: TrackingEvent[];
  showTimestamps?: boolean;
}

export function TimelineHorizontal({ events, showTimestamps = true }: TimelineHorizontalProps) {
  return (
    <div className="flex items-center justify-between">
      {events.map((event, index) => {
        const Icon = statusIcons[event.status];
        const colorClass = statusColors[event.status];
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: event.isCompleted || event.isCurrent ? 1 : 0.5 }}
                className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", colorClass,
                  event.isCompleted && "bg-current text-white",
                  event.isCurrent && "ring-4 ring-primary/20"
                )}
              >
                {event.isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </motion.div>
              <div className="mt-2 text-center">
                <p className={cn("text-xs font-medium", (event.isCompleted || event.isCurrent) ? "text-foreground" : "text-muted-foreground")}>
                  {event.title}
                </p>
                {showTimestamps && event.isCompleted && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
            {!isLast && (
              <div className={cn("h-0.5 flex-1 mx-2 transition-colors", events[index + 1]?.isCompleted ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
