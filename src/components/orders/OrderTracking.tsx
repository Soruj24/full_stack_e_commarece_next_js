"use client";

import { cn } from "@/lib/utils";
import type { TrackingEvent } from "@/features/orders/context/OrderTrackingContext";
import { TimelineHorizontal } from "./order-tracking/TimelineHorizontal";
import { TimelineCompact } from "./order-tracking/TimelineCompact";
import { TimelineVertical } from "./order-tracking/TimelineVertical";

interface OrderTimelineProps {
  events: TrackingEvent[];
  variant?: "vertical" | "horizontal" | "compact";
  showTimestamps?: boolean;
  className?: string;
}

export function OrderTimeline({ events, variant = "vertical", showTimestamps = true, className }: OrderTimelineProps) {
  if (variant === "horizontal") {
    return <div className={cn("relative", className)}><TimelineHorizontal events={events} showTimestamps={showTimestamps} /></div>;
  }

  if (variant === "compact") {
    return <div className={cn("space-y-2", className)}><TimelineCompact events={events} /></div>;
  }

  return <div className={cn("space-y-0", className)}><TimelineVertical events={events} showTimestamps={showTimestamps} /></div>;
}

export { OrderStatusBadge } from "./order-tracking/OrderStatusBadge";
export { EstimatedDelivery } from "./order-tracking/EstimatedDelivery";
