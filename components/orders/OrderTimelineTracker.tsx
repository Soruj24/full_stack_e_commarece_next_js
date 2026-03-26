"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  Circle, 
  Clock,
  MapPin,
  Package,
  Truck,
  Home,
  CreditCard,
  ClipboardCheck,
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

export function OrderTimelineTracker({
  events,
  currentStatus,
  estimatedDelivery,
  className,
}: OrderTimelineTrackerProps) {
  const getEventStatus = (event: TimelineEvent, index: number) => {
    if (index === 0 && events.length > 1) return "completed";
    if (index === events.length - 1) return currentStatus === event.status ? "current" : "upcoming";
    if (currentStatus && isStatusAfter(currentStatus, event.status)) return "completed";
    if (currentStatus === event.status) return "current";
    return "upcoming";
  };

  const isStatusAfter = (current: string, target: string): boolean => {
    const statusOrder = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];
    return statusOrder.indexOf(current) > statusOrder.indexOf(target);
  };

  const statusStyles = {
    completed: {
      dot: "bg-green-500",
      line: "bg-green-500",
      iconBg: "bg-green-500",
      iconColor: "text-white",
      text: "text-foreground",
      desc: "text-muted-foreground",
    },
    current: {
      dot: "bg-primary ring-4 ring-primary/20",
      line: "bg-zinc-200 dark:bg-zinc-700",
      iconBg: "bg-primary",
      iconColor: "text-primary-foreground",
      text: "text-foreground font-semibold",
      desc: "text-muted-foreground",
    },
    upcoming: {
      dot: "bg-zinc-300 dark:bg-zinc-600",
      line: "bg-zinc-200 dark:bg-zinc-700",
      iconBg: "bg-zinc-100 dark:bg-zinc-800",
      iconColor: "text-muted-foreground",
      text: "text-muted-foreground",
      desc: "text-muted-foreground/60",
    },
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Timeline */}
      <div className="relative">
        {events.map((event, index) => {
          const status = getEventStatus(event, index);
          const styles = statusStyles[status];
          const isLast = index === events.length - 1;

          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Timeline Line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[19px] top-10 bottom-0 w-0.5",
                    styles.line
                  )}
                />
              )}

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  styles.iconBg
                )}
              >
                {status === "completed" ? (
                  <Check className={cn("w-5 h-5", styles.iconColor)} />
                ) : (
                  <span className={styles.iconColor}>
                    {event.icon || STATUS_ICONS[event.status.toLowerCase()] || <Circle className="w-4 h-4" />}
                  </span>
                )}
              </motion.div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className={cn("text-sm", styles.text)}>
                      {event.title}
                    </h4>
                    {event.description && (
                      <p className={cn("text-xs mt-0.5", styles.desc)}>
                        {event.description}
                      </p>
                    )}
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

      {/* Estimated Delivery */}
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

interface OrderProgressBarProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

export function OrderProgressBar({ currentStep, steps, className }: OrderProgressBarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  isCompleted && "bg-green-500 text-white",
                  isCurrent && "bg-primary text-primary-foreground",
                  isUpcoming && "bg-zinc-200 dark:bg-zinc-700 text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-2 text-[10px] font-medium text-center max-w-[80px]",
                  isCompleted && "text-green-600",
                  isCurrent && "text-primary",
                  isUpcoming && "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Progress Line */}
      <div className="flex gap-2 px-4">
        {steps.slice(0, -1).map((_, index) => (
          <div key={index} className="flex-1">
            <div
              className={cn(
                "h-1 rounded-full transition-colors",
                index < currentStep ? "bg-green-500" : "bg-zinc-200 dark:bg-zinc-700"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
