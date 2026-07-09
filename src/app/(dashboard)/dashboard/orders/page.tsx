"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useOrdersPage, STATUS_CONFIG } from "@/modules/orders/hooks/use-orders-page";
import { motion } from "framer-motion";

const filters = ["all", "processing", "shipped", "delivered"] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function OrdersPage() {
  const { filteredOrders, filter, setFilter } = useOrdersPage();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-1">Track and manage your orders</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => {
            const config = f !== "all" ? STATUS_CONFIG[f] : null;
            const Icon = config?.icon;
            return (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full capitalize gap-1.5 transition-all",
                  filter === f && "shadow-md"
                )}
                onClick={() => setFilter(f)}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {f === "all" ? "All Orders" : config?.label}
              </Button>
            );
          })}
        </div>

        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-bold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">No orders match the selected filter.</p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filteredOrders.map((order) => {
              const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.processing;
              const Icon = config.icon;
              return (
                <motion.div key={order.id} variants={item}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold text-sm">{order.id}</h3>
                            <Badge className={cn("gap-1 capitalize", config.color)}>
                              <Icon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5"
                              >
                                <div className="w-8 h-8 rounded-md bg-muted overflow-hidden shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-sm truncate max-w-[160px]">
                                  {item.name}
                                </span>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  x{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
