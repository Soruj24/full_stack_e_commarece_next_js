"use client";

import { useOrderTracking, OrderStatus } from "@/context/OrderTrackingContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Truck,
  Check,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderTrackingWidgetProps {
  orderId: string;
  status: OrderStatus;
  estimatedDelivery?: string;
  compact?: boolean;
  className?: string;
}

export function OrderTrackingWidget({
  orderId,
  status,
  estimatedDelivery,
  compact = false,
  className,
}: OrderTrackingWidgetProps) {
  const { getTracking } = useOrderTracking();
  const tracking = getTracking(orderId);

  const statusSteps = [
    { key: "pending", label: "Placed" },
    { key: "confirmed", label: "Confirmed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const currentIndex = statusSteps.findIndex((s) => s.key === status);
  const isDelivered = status === "delivered";
  const isActive = !isDelivered && status !== "cancelled" && status !== "refunded";

  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Delivery Progress</span>
          </div>
          <Link href={`/orders/${orderId}/tracking`}>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Track
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {statusSteps.map((step, index) => (
            <div
              key={step.key}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                index <= currentIndex ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {isDelivered
            ? "Delivered"
            : estimatedDelivery
            ? `Est. ${new Date(estimatedDelivery).toLocaleDateString()}`
            : "In transit"}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-2xl border p-4 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isActive ? (
            <div className="p-2 bg-primary/10 rounded-lg">
              <Truck className="w-5 h-5 text-primary" />
            </div>
          ) : (
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">
              {isDelivered ? "Order Delivered" : "On the way"}
            </p>
            {estimatedDelivery && !isDelivered && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Est. {new Date(estimatedDelivery).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <Link href={`/orders/${orderId}/tracking`}>
          <Button variant="outline" size="sm" className="gap-1">
            Details
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-1">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted ? "rgb(13, 148, 136)" : "rgb(226, 232, 240)",
                }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isCurrent && "ring-4 ring-primary/20"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                )}
              </motion.div>
              <span
                className={cn(
                  "text-[10px] mt-1 text-center",
                  isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface RecentTrackingCardProps {
  orderId: string;
  status: OrderStatus;
  estimatedDelivery?: string;
  className?: string;
}

export function RecentTrackingCard({
  orderId,
  status,
  estimatedDelivery,
  className,
}: RecentTrackingCardProps) {
  const isActive = status !== "delivered" && status !== "cancelled" && status !== "refunded";

  if (!isActive) return null;

  return (
    <Link href={`/orders/${orderId}/tracking`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "bg-gradient-to-r from-primary/10 to-fuchsia-500/10 rounded-2xl border p-4 cursor-pointer transition-shadow hover:shadow-lg",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Truck className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Track Order #{orderId.slice(-6).toUpperCase()}</p>
            <p className="text-xs text-muted-foreground">
              {status === "shipped" && "Your package is on the way!"}
              {status === "out_for_delivery" && "Out for delivery today!"}
              {estimatedDelivery && `Est. ${new Date(estimatedDelivery).toLocaleDateString()}`}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-primary" />
        </div>
      </motion.div>
    </Link>
  );
}
