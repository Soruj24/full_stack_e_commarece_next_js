"use client";

import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/types";

interface OrderInfoSectionProps {
  order: IOrder;
}

export function OrderInfoSection({ order }: OrderInfoSectionProps) {
  return (
    <div className="p-10 border-b border-border/50 bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Order ID
        </p>
        <h3 className="text-xl font-black uppercase">
          {order._id.slice(-12)}
        </h3>
      </div>
      <div className="flex gap-3">
        <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
          {order.orderStatus}
        </Badge>
        <Badge className="bg-green-500/10 text-green-500 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
          {order.paymentStatus}
        </Badge>
      </div>
    </div>
  );
}