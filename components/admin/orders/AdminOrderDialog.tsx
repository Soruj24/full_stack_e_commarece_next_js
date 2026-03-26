"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Order {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string } | null;
  items: Array<{ name: string; quantity: number; price: number; image?: string }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface AdminOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSuccess: () => void;
}

export function AdminOrderDialog({
  open,
  onOpenChange,
  order,
}: AdminOrderDialogProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-amber-500";
      case "shipped":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order #{order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(order.orderStatus)}`} />
            <div>
              <p className="font-medium capitalize">{order.orderStatus}</p>
              <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              {order.paymentStatus}
            </Badge>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Customer Information</h4>
            <div className="text-sm">
              <p className="font-medium">{order.user?.name || "Guest"}</p>
              <p className="text-muted-foreground">{order.user?.email || "N/A"}</p>
            </div>
          </div>

          {order.shippingAddress && (
            <div>
              <h4 className="font-medium mb-3">Shipping Address</h4>
              <div className="text-sm text-muted-foreground">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-3">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <p className="font-medium">Total</p>
            <p className="font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Payment Method: {order.paymentMethod}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
