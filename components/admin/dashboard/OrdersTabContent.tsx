"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Eye, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function OrdersTabContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/orders${filter !== "all" ? `?status=${filter}` : ""}`,
      );
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order marked as ${status}`);
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleRefund = async (orderId: string) => {
    if (!confirm("Are you sure you want to refund this order?")) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentStatus: "refunded",
          orderStatus: "returned",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order refunded successfully");
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to process refund");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search orders by ID or customer..."
            className="pl-12 h-14 rounded-2xl bg-muted/50 border-border/50 focus:bg-background transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {[
            "all",
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "returned",
          ].map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full px-6 h-10 font-black text-[10px] uppercase tracking-widest transition-all",
                filter === s
                  ? "shadow-lg shadow-primary/20"
                  : "border-border/50 hover:bg-primary/5",
              )}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-muted/50 rounded-3xl animate-pulse"
            />
          ))
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-dashed border-border/50">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-black text-muted-foreground/60 uppercase tracking-widest">
              No orders found
            </p>
          </div>
        ) : (
          orders.map(
            (order: {
              _id: string;
              orderStatus: string;
              paymentStatus: string;
            }) => (
              <div
                key={order._id}
                className="p-6 md:p-8 rounded-[32px] bg-card border border-border/50 hover:border-primary/30 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-black text-lg uppercase tracking-tight truncate">
                          #{order._id.slice(-8)}
                        </h4>
                        <Badge
                          className={cn(
                            "px-3 py-0.5 rounded-full font-black text-[10px] uppercase tracking-widest border-none",
                            order.orderStatus === "delivered"
                              ? "bg-green-500/10 text-green-500"
                              : order.orderStatus === "cancelled"
                                ? "bg-destructive/10 text-destructive"
                                : order.orderStatus === "returned"
                                  ? "bg-orange-500/10 text-orange-500"
                                  : "bg-primary/10 text-primary",
                          )}
                        >
                          {order.orderStatus}
                        </Badge>
                        {order.paymentStatus === "refunded" && (
                          <Badge className="px-3 py-0.5 rounded-full font-black text-[10px] uppercase tracking-widest border-none bg-orange-500/10 text-orange-500">
                            REFUNDED
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className="text-foreground font-black">
                          {(order as { user?: { name?: string } }).user?.name ||
                            "Unknown Customer"}
                        </span>{" "}
                        •{" "}
                        {
                          (
                            (
                              order as {
                                items?: { _id: string; quantity: number }[];
                              }
                            ).items || []
                          ).length
                        }{" "}
                        items
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        {(order as { createdAt?: string }).createdAt
                          ? new Date(
                              (order as { createdAt?: string }).createdAt!,
                            ).toLocaleDateString()
                          : "N/A"}{" "}
                        at{" "}
                        {(order as { createdAt?: string }).createdAt
                          ? new Date(
                              (order as { createdAt?: string }).createdAt!,
                            ).toLocaleTimeString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-right sm:pr-8 sm:border-r border-border/50 w-full sm:w-auto">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-2xl font-black tracking-tighter text-primary">
                        ${(
                          (order as { totalAmount?: number }).totalAmount || 0
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {order.orderStatus === "pending" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateOrderStatus(order._id, "processing")
                          }
                          className="rounded-xl font-black text-[10px] uppercase tracking-widest flex-1 sm:flex-none"
                        >
                          Process
                        </Button>
                      )}
                      {order.orderStatus === "processing" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateOrderStatus(order._id, "shipped")
                          }
                          className="rounded-xl font-black text-[10px] uppercase tracking-widest flex-1 sm:flex-none"
                        >
                          Ship Order
                        </Button>
                      )}
                      {order.orderStatus === "shipped" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateOrderStatus(order._id, "delivered")
                          }
                          className="rounded-xl font-black text-[10px] uppercase tracking-widest flex-1 sm:flex-none"
                        >
                          Delivered
                        </Button>
                      )}
                      {order.orderStatus === "delivered" &&
                        order.paymentStatus !== "refunded" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefund(order._id)}
                            className="rounded-xl font-black text-[10px] uppercase tracking-widest flex-1 sm:flex-none border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                          >
                            <RotateCcw className="w-3 h-3 mr-2" />
                            Refund
                          </Button>
                        )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-border/50 shrink-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.orderStatus !== "cancelled" &&
                        order.orderStatus !== "returned" && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl border-border/50 text-destructive shrink-0"
                            onClick={() =>
                              updateOrderStatus(order._id, "cancelled")
                            }
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}
