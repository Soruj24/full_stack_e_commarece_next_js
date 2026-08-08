"use client";

import Image from "next/image";
import { useState } from "react";
import {
  X,
  User,
  MapPin,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Copy,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { IOrder } from "@/core/database/models/Order";
import { cn } from "@/lib/utils";

interface OrderDetailsDrawerProps {
  order: IOrder | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case "shipped":
      return <Truck className="h-4 w-4 text-blue-500" />;
    case "processing":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "cancelled":
    case "returned":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
}

function getOrderStatusVariant(status: string): "success" | "warning" | "danger" | "info" | "muted" {
  switch (status) {
    case "delivered":
      return "success";
    case "shipped":
      return "info";
    case "processing":
      return "warning";
    case "cancelled":
    case "returned":
      return "danger";
    default:
      return "muted";
  }
}

function getPaymentStatusVariant(status: string): "success" | "warning" | "danger" | "info" | "muted" {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "danger";
    case "refunded":
      return "info";
    default:
      return "muted";
  }
}

const statusSteps = ["processing", "shipped", "delivered"];

export function OrderDetailsDrawer({
  order,
  open,
  onClose,
  onUpdateStatus,
}: OrderDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"details" | "timeline">("details");

  if (!order) return null;

  const user = (order as unknown as { user?: { name?: string; email?: string } }).user;
  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  const timeline = [
    {
      status: "Order Placed",
      date: order.createdAt,
      icon: <Package className="h-4 w-4" />,
      completed: true,
    },
    {
      status: "Processing",
      date: order.createdAt,
      icon: <Clock className="h-4 w-4" />,
      completed: currentStepIndex >= 0,
    },
    {
      status: "Shipped",
      date: order.orderStatus === "shipped" || order.orderStatus === "delivered" ? order.updatedAt : null,
      icon: <Truck className="h-4 w-4" />,
      completed: currentStepIndex >= 1,
    },
    {
      status: "Delivered",
      date: order.orderStatus === "delivered" ? order.deliveredAt || order.updatedAt : null,
      icon: <CheckCircle className="h-4 w-4" />,
      completed: currentStepIndex >= 2,
    },
  ];

  if (order.orderStatus === "cancelled") {
    timeline.push({
      status: "Cancelled",
      date: order.cancelledAt || order.updatedAt,
      icon: <XCircle className="h-4 w-4" />,
      completed: true,
    });
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border/60 z-50 transform transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Order #{String(order._id).slice(-8).toUpperCase()}
              </h2>
              <p className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  navigator.clipboard.writeText(String(order._id));
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex border-b border-border/60">
            <button
              onClick={() => setActiveTab("details")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === "details"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === "timeline"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Timeline
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "details" ? (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                  {getStatusIcon(order.orderStatus)}
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{order.orderStatus}</p>
                    <p className="text-xs text-muted-foreground">Order Status</p>
                  </div>
                  <StatusBadge variant={getOrderStatusVariant(order.orderStatus)}>
                    {order.orderStatus}
                  </StatusBadge>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Customer
                  </h3>
                  <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                    <p className="text-sm font-medium">{user?.name || "Guest"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "N/A"}</p>
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Shipping Address
                    </h3>
                    <div className="p-4 bg-muted/30 rounded-xl text-sm">
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Items ({order.items.length})
                  </h3>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden relative border border-border/60 shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    Payment
                  </h3>
                  <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <StatusBadge variant={getPaymentStatusVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                      </StatusBadge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Method</span>
                      <span className="text-sm font-medium capitalize">{order.paymentMethod}</span>
                    </div>
                    {order.shippingPrice > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Shipping</span>
                        <span className="text-sm font-medium">${order.shippingPrice.toFixed(2)}</span>
                      </div>
                    )}
                    {order.taxPrice > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tax</span>
                        <span className="text-sm font-medium">${order.taxPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-lg font-bold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Update Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(String(order._id), "processing")}
                      disabled={order.orderStatus === "processing"}
                      className="gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Processing
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(String(order._id), "shipped")}
                      disabled={order.orderStatus === "shipped"}
                      className="gap-1.5"
                    >
                      <Truck className="h-3.5 w-3.5" />
                      Shipped
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(String(order._id), "delivered")}
                      disabled={order.orderStatus === "delivered"}
                      className="gap-1.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Delivered
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(String(order._id), "cancelled")}
                      disabled={order.orderStatus === "cancelled"}
                      className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border/60" />
                  <div className="space-y-6">
                    {timeline.map((step, i) => (
                      <div key={i} className="relative flex gap-4">
                        <div
                          className={cn(
                            "relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            step.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {step.icon}
                        </div>
                        <div className="flex-1 pt-1">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              step.completed ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {step.status}
                          </p>
                          {step.date && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(step.date as string | Date).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
