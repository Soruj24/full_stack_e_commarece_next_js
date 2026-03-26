"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const mockOrders = [
  {
    id: "ORD-2024-123456",
    date: "March 15, 2024",
    status: "delivered",
    total: 259.97,
    items: [
      { name: "Wireless Headphones Pro", quantity: 1, price: 149.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
      { name: "Phone Case Premium", quantity: 2, price: 29.99, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&h=100&fit=crop" },
    ],
  },
  {
    id: "ORD-2024-123455",
    date: "March 10, 2024",
    status: "shipped",
    total: 89.99,
    items: [
      { name: "Smart Watch Band", quantity: 1, price: 89.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
    ],
  },
  {
    id: "ORD-2024-123454",
    date: "March 5, 2024",
    status: "processing",
    total: 199.99,
    items: [
      { name: "Bluetooth Speaker", quantity: 1, price: 199.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop" },
    ],
  },
  {
    id: "ORD-2024-123453",
    date: "February 28, 2024",
    status: "delivered",
    total: 349.99,
    items: [
      { name: "Mechanical Keyboard", quantity: 1, price: 349.99, image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=100&h=100&fit=crop" },
    ],
  },
];

const statusConfig = {
  delivered: { icon: CheckCircle, color: "text-green-500 bg-green-500/10", label: "Delivered" },
  shipped: { icon: Truck, color: "text-blue-500 bg-blue-500/10", label: "Shipped" },
  processing: { icon: Clock, color: "text-yellow-500 bg-yellow-500/10", label: "Processing" },
  cancelled: { icon: XCircle, color: "text-red-500 bg-red-500/10", label: "Cancelled" },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");

  const filteredOrders = filter === "all" 
    ? mockOrders 
    : mockOrders.filter(o => o.status === filter);

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing;
    return <config.icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </motion.div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {["all", "processing", "shipped", "delivered"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className="rounded-xl font-bold capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order, index) => {
            const orderStatusConfig = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = orderStatusConfig?.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-6 bg-muted/30 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-bold">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${orderStatusConfig?.color || ""}`}>
                        {getStatusIcon(order.status)}
                        <span className="font-bold text-sm">{orderStatusConfig?.label}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-4 mb-6">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" className="rounded-xl" asChild>
                          <Link href={`/orders/${order.id}/tracking`}>
                            <Truck className="w-4 h-4 mr-2" />
                            Track Order
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl" asChild>
                          <Link href={`/orders/${order.id}`}>
                            View Details
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm" className="rounded-xl">
                            Buy Again
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">You haven&apos;t placed any orders in this category yet.</p>
              <Button asChild className="rounded-xl">
                <Link href="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
