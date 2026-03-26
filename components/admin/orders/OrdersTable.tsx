"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Eye, Truck, XCircle, CheckCircle } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string } | null;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onView: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export function OrdersTable({
  orders,
  loading,
  onView,
  onUpdateStatus,
}: OrdersTableProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "returned":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "refunded":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Order Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[70px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{order.user?.name || "Guest"}</p>
                <p className="text-sm text-muted-foreground">{order.user?.email || "N/A"}</p>
              </div>
            </TableCell>
            <TableCell>{order.items.length} items</TableCell>
            <TableCell className="font-medium">
              ${order.totalAmount.toFixed(2)}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusBadgeColor(order.orderStatus)}>
                {order.orderStatus}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <Badge variant="outline" className={getPaymentBadgeColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
                <span className="text-xs text-muted-foreground">{order.paymentMethod}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(order.createdAt)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(order)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateStatus(order._id, "shipped")}>
                    <Truck className="mr-2 h-4 w-4" />
                    Mark Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateStatus(order._id, "delivered")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Delivered
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(order._id, "cancelled")}
                    className="text-destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
