"use client";

import { CheckCircle2, X, Clock, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { OrderStatus } from "@/modules/orders/context/OrderTrackingContext";

interface EstimatedDeliveryProps {
  estimatedDate?: string;
  status: OrderStatus;
  className?: string;
}

export function EstimatedDelivery({ estimatedDate, status, className }: EstimatedDeliveryProps) {
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
        <span className="font-medium">{status === "cancelled" ? "Order Cancelled" : "Order Refunded"}</span>
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
