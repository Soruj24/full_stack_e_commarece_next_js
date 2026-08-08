"use client";

import { Package, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import Link from "next/link";

interface Order {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  user?: { name: string; email: string };
}

interface RecentOrdersTableProps {
  orders: Order[];
  loading?: boolean;
}

function getStatusVariant(status: string): "success" | "warning" | "danger" | "info" | "muted" {
  switch (status?.toLowerCase()) {
    case "delivered":
    case "completed":
      return "success";
    case "shipped":
    case "processing":
      return "info";
    case "pending":
      return "warning";
    case "cancelled":
    case "refunded":
      return "danger";
    default:
      return "muted";
  }
}

export function RecentOrdersTable({ orders, loading }: RecentOrdersTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60">
          <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-border/60">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4">
              <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Package className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/60">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Order</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Amount</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3">
                    <span className="text-sm font-medium text-foreground">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm text-muted-foreground">
                      {order.user?.name || "Guest"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge variant={getStatusVariant(order.orderStatus)}>
                      {order.orderStatus}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-sm font-medium text-foreground">
                      ${order.totalAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
