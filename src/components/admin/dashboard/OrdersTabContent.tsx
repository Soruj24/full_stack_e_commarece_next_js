"use client";

import { ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useOrdersTab } from "@/features/orders/hooks/use-orders-tab";
import { OrderCard } from "./OrderCard";

const STATUS_FILTERS = ["all","pending","processing","shipped","delivered","cancelled","returned"];

export function OrdersTabContent() {
  const { orders, loading, filter, setFilter, updateOrderStatus, handleRefund } = useOrdersTab();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input placeholder="Search orders by ID or customer..." className="pl-12 h-14 rounded-2xl bg-muted/50 border-border/50 focus:bg-background transition-all" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {STATUS_FILTERS.map((s) => (
            <Button key={s} variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}
              className={cn("rounded-full px-6 h-10 font-black text-[10px] uppercase tracking-widest transition-all",
                filter === s ? "shadow-lg shadow-primary/20" : "border-border/50 hover:bg-primary/5")}>
              {s}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 bg-muted/50 rounded-3xl animate-pulse" />)
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-dashed border-border/50">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-black text-muted-foreground/60 uppercase tracking-widest">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id} order={order} onUpdateStatus={updateOrderStatus} onRefund={handleRefund} />
          ))
        )}
      </div>
    </div>
  );
}
