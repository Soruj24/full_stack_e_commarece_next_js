"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface StockAlert {
  productId: string;
  productName: string;
  productImage?: string;
  email: string;
  createdAt: number;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "pre_order";

interface StockContextType {
  alerts: StockAlert[];
  subscribeToStockAlert: (productId: string, productName: string, productImage?: string, email?: string) => Promise<boolean>;
  unsubscribeFromStockAlert: (productId: string) => void;
  isSubscribed: (productId: string) => boolean;
  checkStockStatus: (stock: number, preOrder?: boolean) => StockStatus;
  getStockLabel: (stock: number, preOrder?: boolean) => string;
  getStockColor: (stock: number, preOrder?: boolean) => string;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const STORAGE_KEY = "stock_alerts";
const MAX_ALERTS = 20;

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setAlerts(parsed.slice(0, MAX_ALERTS));
        }
      }
    } catch {
      console.error("Failed to load stock alerts");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
      } catch {
        console.error("Failed to save stock alerts");
      }
    }
  }, [alerts, isInitialized]);

  const subscribeToStockAlert = useCallback(async (
    productId: string,
    productName: string,
    productImage?: string,
    email?: string
  ): Promise<boolean> => {
    if (alerts.some((a) => a.productId === productId)) {
      toast.info("You're already subscribed to this product");
      return false;
    }

    if (alerts.length >= MAX_ALERTS) {
      toast.error("Maximum alert limit reached. Remove some alerts first.");
      return false;
    }

    const newAlert: StockAlert = {
      productId,
      productName,
      productImage,
      email: email || "",
      createdAt: Date.now(),
    };

    setAlerts((prev) => [newAlert, ...prev].slice(0, MAX_ALERTS));
    toast.success(`You'll be notified when "${productName}" is back in stock`);
    return true;
  }, [alerts]);

  const unsubscribeFromStockAlert = useCallback((productId: string) => {
    setAlerts((prev) => {
      const alert = prev.find((a) => a.productId === productId);
      if (alert) {
        toast.info(`Removed alert for "${alert.productName}"`);
      }
      return prev.filter((a) => a.productId !== productId);
    });
  }, []);

  const isSubscribed = useCallback((productId: string) => {
    return alerts.some((a) => a.productId === productId);
  }, [alerts]);

  const checkStockStatus = useCallback((stock: number, preOrder?: boolean): StockStatus => {
    if (preOrder) return "pre_order";
    if (stock === 0) return "out_of_stock";
    if (stock <= 5) return "low_stock";
    return "in_stock";
  }, []);

  const getStockLabel = useCallback((stock: number, preOrder?: boolean): string => {
    if (preOrder) return "Pre-order";
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return `Only ${stock} left!`;
    return "In Stock";
  }, []);

  const getStockColor = useCallback((stock: number, preOrder?: boolean): string => {
    if (preOrder) return "text-blue-500";
    if (stock === 0) return "text-red-500";
    if (stock <= 5) return "text-orange-500";
    return "text-green-500";
  }, []);

  return (
    <StockContext.Provider
      value={{
        alerts,
        subscribeToStockAlert,
        unsubscribeFromStockAlert,
        isSubscribed,
        checkStockStatus,
        getStockLabel,
        getStockColor,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return context;
};
