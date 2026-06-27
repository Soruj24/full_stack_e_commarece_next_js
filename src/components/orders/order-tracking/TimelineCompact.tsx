"use client";

import { cn } from "@/lib/utils";
import { statusIcons, statusColors } from "@/lib/data/order-tracking";
import { format } from "date-fns";
import type { TrackingEvent } from "@/features/orders/context/OrderTrackingContext";

interface TimelineCompactProps {
  events: TrackingEvent[];
}

export function TimelineCompact({ events }: TimelineCompactProps) {
  const completed = events.filter(e => e.isCompleted);

  return (
    <div className="space-y-2">
      {completed.map((event, index) => {
        const Icon = statusIcons[event.status];
        const colorClass = statusColors[event.status];

        return (
          <div key={event.id} className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", colorClass)}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
