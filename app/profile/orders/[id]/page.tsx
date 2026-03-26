"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IOrder } from "@/types";
import {
  OrderDetailsHeader,
  OrderDetailsLoading,
  OrderDetailsNotFound,
  OrderInfoSection,
  OrderDetailsGrid,
  OrderItemsList,
  OrderSummary,
  OrderDetailsFooter,
} from "@/components/orders/details";

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  if (loading) return <OrderDetailsLoading />;
  if (!order) return <OrderDetailsNotFound />;

  return (
    <div className="min-h-screen bg-background/95 py-16 lg:py-24 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <OrderDetailsHeader order={order} />

        <OrderDetailsCard order={order} />

        <OrderDetailsFooter order={order} />
      </div>
    </div>
  );
}

function OrderDetailsCard({ order }: { order: IOrder }) {
  return (
    <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden print:border-none print:shadow-none">
      <OrderInfoSection order={order} />
      <OrderDetailsGrid order={order} />
      <div className="px-10 pb-10 space-y-8">
        <div className="h-px bg-border/50" />
        <OrderItemsList order={order} />
        <div className="h-px bg-border/50" />
        <OrderSummary order={order} />
      </div>
    </div>
  );
}
