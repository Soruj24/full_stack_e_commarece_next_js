"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, XCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const mockOrder = {
  id: "ORD-2024-123456",
  status: "shipped",
  estimatedDelivery: "March 28, 2024",
  items: [
    { name: "Wireless Headphones Pro", quantity: 1, price: 149.99 },
    { name: "Phone Case Premium", quantity: 2, price: 29.99 },
  ],
  total: 209.97,
  shippingAddress: {
    street: "123 Commerce Street",
    city: "New York",
    state: "NY",
    zip: "10001",
  },
  timeline: [
    { status: "ordered", title: "Order Placed", date: "March 20, 2024", completed: true },
    { status: "processing", title: "Processing", date: "March 21, 2024", completed: true },
    { status: "shipped", title: "Shipped", date: "March 22, 2024", completed: true },
    { status: "out_for_delivery", title: "Out for Delivery", date: "March 25, 2024", completed: false },
    { status: "delivered", title: "Delivered", date: "Est. March 28, 2024", completed: false },
  ],
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (status === "out_for_delivery") return <Truck className="w-6 h-6 text-primary animate-bounce" />;
    if (status === "delivered") return <Package className="w-6 h-6 text-muted-foreground" />;
    return <Clock className="w-6 h-6 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6">
            <Package className="w-4 h-4" />
            Order Tracking
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Order</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your order ID and email to see the latest status of your delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none shadow-2xl shadow-primary/5 rounded-[32px] overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-bold text-foreground mb-2 block">Order ID</label>
                  <Input
                    placeholder="Enter order ID (e.g., ORD-2024-123456)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-bold text-foreground mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" size="lg" className="h-12 px-8 rounded-xl font-bold shadow-lg">
                    <Search className="w-5 h-5 mr-2" />
                    Track
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-8"
          >
            <Card className="border-none shadow-xl rounded-[24px]">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                    <p className="text-2xl font-black">{mockOrder.id}</p>
                  </div>
                  <div className="mt-4 md:mt-0 px-4 py-2 bg-green-500/10 text-green-600 rounded-full font-bold text-sm">
                    In Transit
                  </div>
                </div>

                <div className="bg-muted/30 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Truck className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Estimated Delivery</p>
                      <p className="text-muted-foreground">{mockOrder.estimatedDelivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{mockOrder.shippingAddress.street}, {mockOrder.shippingAddress.city}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {mockOrder.timeline.map((step, index) => (
                    <div key={step.status} className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? "bg-green-500/10" 
                            : step.status === "out_for_delivery"
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}>
                          {getStatusIcon(step.status, step.completed)}
                        </div>
                        {index < mockOrder.timeline.length - 1 && (
                          <div className={`absolute top-10 left-1/2 w-0.5 h-8 -translate-x-1/2 ${
                            step.completed ? "bg-green-500" : "bg-muted"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 py-2">
                        <p className={`font-bold ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[24px]">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl mb-6">Order Details</h3>
                <div className="space-y-4">
                  {mockOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-4 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="font-bold text-lg">Total</p>
                    <p className="font-black text-2xl text-primary">${mockOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Need help with your order?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="rounded-xl" asChild>
              <a href="/contact">Contact Support</a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl" asChild>
              <a href="/faq">View FAQ</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
