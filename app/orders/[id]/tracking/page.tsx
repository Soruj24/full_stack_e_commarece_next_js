"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderTracking, OrderStatus } from "@/context/OrderTrackingContext";
import {
  OrderTimeline,
  OrderStatusBadge,
  EstimatedDelivery,
} from "@/components/orders/OrderTracking";
import { toast } from "sonner";
import {
  TrackingHeader,
  TrackingStatusOverview,
  ShippingAddressCard,
  OrderItemsCard,
  TrackingSupportCard,
} from "@/components/orders/tracking";

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { getTracking, fetchTracking, updateTracking } = useOrderTracking();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderRes = await fetch(`/api/orders/${orderId}`);
        const orderData = await orderRes.json();
        
        if (orderData.success) {
          setOrder(orderData.order);
          
          const existingTracking = getTracking(orderId);
          if (existingTracking) {
            setTracking(existingTracking);
          } else {
            const newTracking = await fetchTracking(orderId);
            setTracking(newTracking);
          }
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, getTracking, fetchTracking]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/tracking`, {
        method: "POST",
      });
      const data = await res.json();
      
      if (data.success && data.tracking) {
        updateTracking(orderId, data.tracking);
        setTracking(data.tracking);
        toast.success("Tracking information updated");
      }
    } catch {
      toast.error("Failed to refresh tracking");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <Link href="/profile/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStatus = tracking?.status || order.orderStatus?.toLowerCase().replace(" ", "_") as OrderStatus;

  return (
    <div className="min-h-screen bg-background/95 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <TrackingHeader
          orderId={orderId}
          lastUpdated={tracking?.lastUpdated}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <TrackingStatusOverview
          currentStatus={currentStatus}
          tracking={tracking}
        />

        {tracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 lg:p-8"
          >
            <h2 className="text-xl font-bold mb-6">Order Progress</h2>
            <OrderTimeline events={tracking.events} variant="vertical" />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShippingAddressCard address={order.shippingAddress} />
          <OrderItemsCard items={order.items || []} totalAmount={order.totalAmount} />
        </div>

        <TrackingSupportCard />
      </div>
    </div>
  );
}