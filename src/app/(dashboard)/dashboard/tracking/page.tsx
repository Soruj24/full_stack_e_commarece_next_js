"use client";

import { Search, Package, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTrackOrder } from "@/modules/orders/hooks/use-track-order";
import { motion } from "framer-motion";

const stepIcons: Record<string, string> = {
  ordered: "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
  processing: "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
  shipped: "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
  out_for_delivery: "bg-amber-500 text-white shadow-lg shadow-amber-500/30",
  delivered: "bg-green-500 text-white shadow-lg shadow-green-500/30",
};

export default function TrackingPage() {
  const { orderId, setOrderId, email, setEmail, searched, handleSearch, mockOrder } =
    useTrackOrder();

  const activeStepIndex = mockOrder.timeline.findIndex((s) => !s.completed);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Track Order</h1>
          <p className="text-muted-foreground mt-1">
            Enter your order ID and email to check status
          </p>
        </div>

        <Card className="mb-10">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Order ID (e.g. ORD-2024-123456)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <Button type="submit" className="h-11 gap-2 shrink-0">
                <Search className="h-4 w-4" />
                Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    {mockOrder.id}
                  </CardTitle>
                  <Badge variant="info" size="sm" className="capitalize">
                    {mockOrder.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Items</p>
                    <p className="font-semibold">{mockOrder.items.length} product(s)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Total</p>
                    <p className="font-semibold">${mockOrder.total.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">Estimated Delivery</p>
                    <p className="font-semibold">{mockOrder.estimatedDelivery}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping to
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {mockOrder.shippingAddress.street}, {mockOrder.shippingAddress.city},{" "}
                  {mockOrder.shippingAddress.state} {mockOrder.shippingAddress.zip}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />
                  <div className="space-y-0">
                    {mockOrder.timeline.map((step, idx) => {
                      const isActive = idx === activeStepIndex && step.completed === false;
                      const isPast = step.completed;
                      const isFuture = !step.completed && idx > activeStepIndex;
                      return (
                        <div key={step.status} className="relative flex gap-5 pb-8 last:pb-0">
                          <div
                            className={cn(
                              "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                              isPast
                                ? stepIcons[step.status] || "bg-primary text-primary-foreground"
                                : isActive
                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {idx + 1}
                          </div>
                          <div className="flex-1 pt-1.5">
                            <div className="flex items-center justify-between">
                              <h4
                                className={cn(
                                  "font-semibold text-sm",
                                  isFuture && "text-muted-foreground/50"
                                )}
                              >
                                {step.title}
                              </h4>
                              <span
                                className={cn(
                                  "text-xs",
                                  isFuture
                                    ? "text-muted-foreground/40"
                                    : "text-muted-foreground"
                                )}
                              >
                                {step.date}
                              </span>
                            </div>
                            {isActive && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                <ChevronDown className="h-3 w-3" />
                                Current step
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
