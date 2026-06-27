import { useState } from "react";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";

const mockOrders = [
  { id: "ORD-2024-123456", date: "March 15, 2024", status: "delivered", total: 259.97, items: [{ name: "Wireless Headphones Pro", quantity: 1, price: 149.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" }, { name: "Phone Case Premium", quantity: 2, price: 29.99, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&h=100&fit=crop" }] },
  { id: "ORD-2024-123455", date: "March 10, 2024", status: "shipped", total: 89.99, items: [{ name: "Smart Watch Band", quantity: 1, price: 89.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" }] },
  { id: "ORD-2024-123454", date: "March 5, 2024", status: "processing", total: 199.99, items: [{ name: "Bluetooth Speaker", quantity: 1, price: 199.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop" }] },
  { id: "ORD-2024-123453", date: "February 28, 2024", status: "delivered", total: 349.99, items: [{ name: "Mechanical Keyboard", quantity: 1, price: 349.99, image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=100&h=100&fit=crop" }] },
];

export const STATUS_CONFIG = {
  delivered: { icon: CheckCircle, color: "text-green-500 bg-green-500/10", label: "Delivered" },
  shipped: { icon: Truck, color: "text-blue-500 bg-blue-500/10", label: "Shipped" },
  processing: { icon: Clock, color: "text-yellow-500 bg-yellow-500/10", label: "Processing" },
  cancelled: { icon: XCircle, color: "text-red-500 bg-red-500/10", label: "Cancelled" },
};

export function useOrdersPage() {
  const [filter, setFilter] = useState("all");

  const filteredOrders = filter === "all" ? mockOrders : mockOrders.filter(o => o.status === filter);

  return { filteredOrders, filter, setFilter };
}
