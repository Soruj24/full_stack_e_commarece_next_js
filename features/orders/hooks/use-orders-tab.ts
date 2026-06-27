"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount?: number;
  createdAt?: string;
  user?: { name?: string };
  items?: { _id: string; quantity: number }[];
}

export function useOrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders${filter !== "all" ? `?status=${filter}` : ""}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: status }),
      });
      const data = await res.json();
      if (data.success) { toast.success(`Order marked as ${status}`); fetchOrders(); }
    } catch { toast.error("Failed to update status"); }
  };

  const handleRefund = async (orderId: string) => {
    if (!confirm("Are you sure you want to refund this order?")) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentStatus: "refunded", orderStatus: "returned" }),
      });
      const data = await res.json();
      if (data.success) { toast.success("Order refunded successfully"); fetchOrders(); }
    } catch { toast.error("Failed to process refund"); }
  };

  return { orders, loading, filter, setFilter, updateOrderStatus, handleRefund };
}
