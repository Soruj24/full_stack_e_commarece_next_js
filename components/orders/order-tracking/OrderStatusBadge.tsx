"use client";

import { cn } from "@/lib/utils";
import { statusIcons, statusColors, statusLabels } from "@/lib/data/order-tracking";
import type { OrderStatus } from "@/features/orders/context/OrderTrackingContext";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const Icon = statusIcons[status];
  const colorClass = statusColors[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold", colorClass, className)}>
      <Icon className="w-3.5 h-3.5" />
      {statusLabels[status]}
    </span>
  );
}
