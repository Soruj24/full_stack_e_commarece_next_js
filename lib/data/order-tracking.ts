import { Check, Clock, Package, Truck, MapPin, RefreshCw, X, CheckCircle2 } from "lucide-react";
import type { OrderStatus } from "@/features/orders/context/OrderTrackingContext";

export const statusIcons: Record<OrderStatus, typeof Check> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle2,
  cancelled: X,
  refunded: RefreshCw,
};

export const statusColors: Record<OrderStatus, string> = {
  pending: "text-muted-foreground bg-muted",
  confirmed: "text-blue-500 bg-blue-500/10",
  processing: "text-purple-500 bg-purple-500/10",
  shipped: "text-indigo-500 bg-indigo-500/10",
  out_for_delivery: "text-orange-500 bg-orange-500/10",
  delivered: "text-green-500 bg-green-500/10",
  cancelled: "text-red-500 bg-red-500/10",
  refunded: "text-amber-500 bg-amber-500/10",
};

export const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};
