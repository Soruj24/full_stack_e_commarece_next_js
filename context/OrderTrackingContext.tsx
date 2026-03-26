"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export type OrderStatus = 
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  estimatedDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  currentStep: number;
  events: TrackingEvent[];
  lastUpdated: string;
}

interface OrderTrackingContextType {
  trackings: Record<string, OrderTracking>;
  getTracking: (orderId: string) => OrderTracking | null;
  addTracking: (tracking: OrderTracking) => void;
  updateTracking: (orderId: string, update: Partial<OrderTracking>) => void;
  clearTracking: (orderId: string) => void;
  fetchTracking: (orderId: string) => Promise<OrderTracking | null>;
}

const OrderTrackingContext = createContext<OrderTrackingContextType | undefined>(undefined);

const STATUS_STEPS: { status: OrderStatus; title: string; description: string }[] = [
  { status: "pending", title: "Order Placed", description: "Your order has been received" },
  { status: "confirmed", title: "Order Confirmed", description: "Seller has confirmed your order" },
  { status: "processing", title: "Processing", description: "Your order is being prepared" },
  { status: "shipped", title: "Shipped", description: "Your order has been shipped" },
  { status: "out_for_delivery", title: "Out for Delivery", description: "Your order is out for delivery" },
  { status: "delivered", title: "Delivered", description: "Your order has been delivered" },
];

const STORAGE_KEY = "order_tracking";

export function OrderTrackingProvider({ children }: { children: React.ReactNode }) {
  const [trackings, setTrackings] = useState<Record<string, OrderTracking>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object") {
          setTrackings(parsed);
        }
      }
    } catch {
      console.error("Failed to load order tracking");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trackings));
      } catch {
        console.error("Failed to save order tracking");
      }
    }
  }, [trackings, isInitialized]);

  const getStatusIndex = (status: OrderStatus): number => {
    if (status === "cancelled" || status === "refunded") return -1;
    const index = STATUS_STEPS.findIndex((s) => s.status === status);
    return index;
  };

  const generateEvents = (status: OrderStatus, orderId: string): TrackingEvent[] => {
    const currentIndex = getStatusIndex(status);
    const isCancelled = status === "cancelled";
    const isRefunded = status === "refunded";

    return STATUS_STEPS.map((step, index) => {
      const isCompleted = currentIndex >= index;
      const isCurrent = currentIndex === index;

      let eventStatus = step.status;
      if (isCancelled) eventStatus = "cancelled";
      if (isRefunded) eventStatus = "refunded";

      return {
        id: `${orderId}-${step.status}`,
        status: eventStatus,
        title: step.title,
        description: step.description,
        timestamp: new Date(Date.now() - (currentIndex - index) * 24 * 60 * 60 * 1000).toISOString(),
        isCompleted,
        isCurrent,
      };
    });
  };

  const getTracking = useCallback((orderId: string): OrderTracking | null => {
    return trackings[orderId] || null;
  }, [trackings]);

  const addTracking = useCallback((tracking: OrderTracking) => {
    setTrackings((prev) => ({
      ...prev,
      [tracking.orderId]: tracking,
    }));
  }, []);

  const updateTracking = useCallback((orderId: string, update: Partial<OrderTracking>) => {
    setTrackings((prev) => {
      const existing = prev[orderId];
      if (!existing) return prev;

      const newStatus = update.status || existing.status;
      const currentStep = getStatusIndex(newStatus);

      return {
        ...prev,
        [orderId]: {
          ...existing,
          ...update,
          currentStep,
          events: generateEvents(newStatus, orderId),
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  }, []);

  const clearTracking = useCallback((orderId: string) => {
    setTrackings((prev) => {
      const { [orderId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const fetchTracking = useCallback(async (orderId: string): Promise<OrderTracking | null> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/tracking`);
      const data = await res.json();
      
      if (data.success && data.tracking) {
        const tracking = data.tracking as OrderTracking;
        addTracking(tracking);
        return tracking;
      }
      return null;
    } catch {
      console.error("Failed to fetch tracking");
      return null;
    }
  }, [addTracking]);

  return (
    <OrderTrackingContext.Provider
      value={{
        trackings,
        getTracking,
        addTracking,
        updateTracking,
        clearTracking,
        fetchTracking,
      }}
    >
      {children}
    </OrderTrackingContext.Provider>
  );
}

export const useOrderTracking = () => {
  const context = useContext(OrderTrackingContext);
  if (!context) {
    throw new Error("useOrderTracking must be used within an OrderTrackingProvider");
  }
  return context;
};
