"use client";

import { ShoppingBag, Eye, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount?: number;
  createdAt?: string;
  user?: { name?: string };
  items?: { _id: string; quantity: number }[];
}

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: string) => void;
  onRefund: (orderId: string) => void;
}

export function OrderCard({ order, onUpdateStatus, onRefund }: OrderCardProps) {
  return (
    <div className="p-6 md:p-8 rounded-[32px] bg-card border border-border/50 hover:border-primary/30 transition-all group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-3">
              <h4 className="font-black text-lg uppercase tracking-tight truncate">#{order._id.slice(-8)}</h4>
              <Badge className={cn("px-3 py-0.5 rounded-full font-black text-[10px] uppercase tracking-widest border-none",
                order.orderStatus === "delivered" ? "bg-green-500/10 text-green-500" :
                order.orderStatus === "cancelled" ? "bg-destructive/10 text-destructive" :
                order.orderStatus === "returned" ? "bg-orange-500/10 text-orange-500" :
                "bg-primary/10 text-primary")}>{order.orderStatus}</Badge>
              {order.paymentStatus === "refunded" && (
                <Badge className="px-3 py-0.5 rounded-full font-black text-[10px] uppercase tracking-widest border-none bg-orange-500/10 text-orange-500">REFUNDED</Badge>
              )}
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              <span className="text-foreground font-black">{order.user?.name || "Unknown Customer"}</span> • {(order.items || []).length} items
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"} at {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : "N/A"}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-right sm:pr-8 sm:border-r border-border/50 w-full sm:w-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-black tracking-tighter text-primary">${(order.totalAmount || 0).toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {order.orderStatus === "pending" && <ActionButton label="Process" onClick={() => onUpdateStatus(order._id, "processing")} />}
            {order.orderStatus === "processing" && <ActionButton label="Ship Order" onClick={() => onUpdateStatus(order._id, "shipped")} />}
            {order.orderStatus === "shipped" && <ActionButton label="Delivered" onClick={() => onUpdateStatus(order._id, "delivered")} />}
            {order.orderStatus === "delivered" && order.paymentStatus !== "refunded" && (
              <Button variant="outline" size="sm" onClick={() => onRefund(order._id)}
                className="rounded-xl font-black text-[10px] uppercase tracking-widest flex-1 sm:flex-none border-orange-500/50 text-orange-500 hover:bg-orange-500/10">
                <RotateCcw className="w-3 h-3 mr-2" />Refund
              </Button>
            )}
            <Button variant="outline" size="icon" className="rounded-xl border-border/50 shrink-0"><Eye className="w-4 h-4" /></Button>
            {order.orderStatus !== "cancelled" && order.orderStatus !== "returned" && (
              <Button variant="outline" size="icon" className="rounded-xl border-border/50 text-destructive shrink-0" onClick={() => onUpdateStatus(order._id, "cancelled")}>
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button size="sm" onClick={onClick} className="rounded-xl font-black text-[10px] uppercase tracking-widest flex-1 sm:flex-none">{label}</Button>
  );
}
