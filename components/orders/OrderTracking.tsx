"use client";

import { TrackingEvent, OrderStatus } from "@/context/OrderTrackingContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Check, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface OrderTimelineProps {
  events: TrackingEvent[];
  variant?: "vertical" | "horizontal" | "compact";
  showTimestamps?: boolean;
  className?: string;
}

const statusIcons: Record<OrderStatus, typeof Check> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle2,
  cancelled: X,
  refunded: RefreshCw,
};

const statusColors: Record<OrderStatus, string> = {
  pending: "text-muted-foreground bg-muted",
  confirmed: "text-blue-500 bg-blue-500/10",
  processing: "text-purple-500 bg-purple-500/10",
  shipped: "text-indigo-500 bg-indigo-500/10",
  out_for_delivery: "text-orange-500 bg-orange-500/10",
  delivered: "text-green-500 bg-green-500/10",
  cancelled: "text-red-500 bg-red-500/10",
  refunded: "text-amber-500 bg-amber-500/10",
};

export function OrderTimeline({
  events,
  variant = "vertical",
  showTimestamps = true,
  className,
}: OrderTimelineProps) {
  if (variant === "horizontal") {
    return (
      <div className={cn("relative", className)}>
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
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      colorClass,
                      event.isCompleted && "bg-current text-white",
                      event.isCurrent && "ring-4 ring-primary/20"
                    )}
                  >
                    {event.isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-xs font-medium",
                      (event.isCompleted || event.isCurrent) ? "text-foreground" : "text-muted-foreground"
                    )}>
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
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 transition-colors",
                      events[index + 1]?.isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        {events.filter(e => e.isCompleted).map((event, index) => {
          const Icon = statusIcons[event.status];
          const colorClass = statusColors[event.status];
          const isLast = index === events.filter(e => e.isCompleted).length - 1;

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

  return (
    <div className={cn("space-y-0", className)}>
      {events.map((event, index) => {
        const Icon = statusIcons[event.status];
        const colorClass = statusColors[event.status];
        const isLast = index === events.length - 1;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all relative z-10",
                  colorClass,
                  event.isCompleted && "bg-current text-white",
                  event.isCurrent && "ring-4 ring-primary/20 animate-pulse"
                )}
              >
                {event.isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 h-16 transition-colors",
                    events[index + 1]?.isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>

            <div className={cn(
              "flex-1 pb-8",
              !event.isCompleted && !event.isCurrent && "opacity-50"
            )}>
              <h4 className={cn(
                "font-semibold text-lg",
                (event.isCompleted || event.isCurrent) && "text-foreground"
              )}>
                {event.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {event.description}
              </p>
              {event.location && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.location}
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

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const Icon = statusIcons[status];
  const colorClass = statusColors[status];

  const statusLabels: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
        colorClass,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {statusLabels[status]}
    </span>
  );
}

interface EstimatedDeliveryProps {
  estimatedDate?: string;
  status: OrderStatus;
  className?: string;
}

export function EstimatedDelivery({
  estimatedDate,
  status,
  className,
}: EstimatedDeliveryProps) {
  if (status === "delivered") {
    return (
      <div className={cn("flex items-center gap-2 text-green-600", className)}>
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium">Delivered</span>
      </div>
    );
  }

  if (status === "cancelled" || status === "refunded") {
    return (
      <div className={cn("flex items-center gap-2 text-red-600", className)}>
        <X className="w-5 h-5" />
        <span className="font-medium">
          {status === "cancelled" ? "Order Cancelled" : "Order Refunded"}
        </span>
      </div>
    );
  }

  if (!estimatedDate) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <Clock className="w-5 h-5" />
        <span className="font-medium">Estimated delivery soon</span>
      </div>
    );
  }

  const date = new Date(estimatedDate);
  const isToday = date.toDateString() === new Date().toDateString();
  const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2">
        <Truck className="w-5 h-5 text-primary" />
        <span className="font-semibold">
          {isToday ? "Arriving Today!" : isTomorrow ? "Arriving Tomorrow" : "Estimated Delivery"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground pl-7">
        {format(date, "EEEE, MMMM d, yyyy")}
      </p>
    </div>
  );
}
