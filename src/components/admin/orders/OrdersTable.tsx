"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { IOrder } from "@/core/database/models/Order";
import type { OrderSortField, OrderSortDirection } from "./useOrdersManager";
import { cn } from "@/lib/utils";

interface OrdersTableProps {
  orders: IOrder[];
  loading: boolean;
  sort: { field: OrderSortField; direction: OrderSortDirection };
  selectedIds: Set<string>;
  onSort: (field: OrderSortField) => void;
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  onView: (order: IOrder) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

function SortHeader({
  label,
  field,
  currentSort,
  onSort,
}: {
  label: string;
  field: OrderSortField;
  currentSort: { field: OrderSortField; direction: OrderSortDirection };
  onSort: (field: OrderSortField) => void;
}) {
  const isActive = currentSort.field === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
    >
      {label}
      {isActive ? (
        currentSort.direction === "asc" ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )
      ) : null}
    </button>
  );
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

function OrderRow({
  order,
  isSelected,
  onSelect,
  onView,
  onUpdateStatus,
}: {
  order: IOrder;
  isSelected: boolean;
  onSelect: () => void;
  onView: (order: IOrder) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const user = (order as unknown as { user?: { name?: string; email?: string } }).user;

  return (
    <tr
      className={cn(
        "border-b border-border/60 transition-colors group",
        isSelected ? "bg-primary/5" : "hover:bg-muted/30"
      )}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 rounded border-border/60 text-primary focus:ring-primary/20 cursor-pointer"
        />
      </td>

      <td className="px-4 py-3">
        <button
          onClick={() => onView(order)}
          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          #{String(order._id).slice(-8).toUpperCase()}
        </button>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
            {user?.name
              ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
              : "G"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || "N/A"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {order.items.slice(0, 3).map((item, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded bg-muted overflow-hidden relative border border-border/60 shrink-0"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{order.items.length - 3}
            </span>
          )}
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          ${order.totalAmount.toFixed(2)}
        </span>
      </td>

      <td className="px-4 py-3">
        <StatusBadge variant={getOrderStatusVariant(order.orderStatus)}>
          {order.orderStatus}
        </StatusBadge>
      </td>

      <td className="px-4 py-3">
        <StatusBadge variant={getPaymentStatusVariant(order.paymentStatus)}>
          {order.paymentStatus}
        </StatusBadge>
      </td>

      <td className="px-4 py-3">
        <span className="text-xs text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onView(order)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setOpen(!open)}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border border-border/60 bg-card shadow-lg py-1">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => {
                      onView(order);
                      setOpen(false);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => {
                      onUpdateStatus(String(order._id), "shipped");
                      setOpen(false);
                    }}
                  >
                    <Truck className="h-3.5 w-3.5" />
                    Mark Shipped
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => {
                      onUpdateStatus(String(order._id), "delivered");
                      setOpen(false);
                    }}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Mark Delivered
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => {
                      onUpdateStatus(String(order._id), "processing");
                      setOpen(false);
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Mark Processing
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                    onClick={() => {
                      onUpdateStatus(String(order._id), "cancelled");
                      setOpen(false);
                    }}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancel Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-border/60 animate-pulse">
          <td className="px-4 py-3">
            <div className="h-4 w-4 rounded bg-muted/50" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-20 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted/50" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 bg-muted/50 rounded" />
                <div className="h-3 w-32 bg-muted/30 rounded" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-1">
              <div className="h-7 w-7 bg-muted/50 rounded" />
              <div className="h-7 w-7 bg-muted/50 rounded" />
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-16 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-16 bg-muted/50 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-16 bg-muted/50 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-20 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-1">
              <div className="h-7 w-7 bg-muted/50 rounded-lg" />
              <div className="h-7 w-7 bg-muted/50 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function OrdersTable({
  orders,
  loading,
  sort,
  selectedIds,
  onSort,
  onSelectAll,
  onSelectOne,
  onView,
  onUpdateStatus,
}: OrdersTableProps) {
  const allSelected = orders.length > 0 && selectedIds.size === orders.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < orders.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card border-b border-border/60">
          <tr>
            <th className="px-4 py-3 text-left w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={onSelectAll}
                className="h-4 w-4 rounded border-border/60 text-primary focus:ring-primary/20 cursor-pointer"
              />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Order" field="createdAt" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Customer
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Products
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Total" field="totalAmount" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Status" field="orderStatus" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Payment" field="paymentStatus" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </span>
            </th>
            <th className="px-4 py-3 text-right">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {loading ? (
            <TableSkeleton />
          ) : orders.length === 0 ? null : (
            orders.map((order) => (
              <OrderRow
                key={String(order._id)}
                order={order}
                isSelected={selectedIds.has(String(order._id))}
                onSelect={() => onSelectOne(String(order._id))}
                onView={onView}
                onUpdateStatus={onUpdateStatus}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
