"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface GuestInfo {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isGuest: boolean;
  orderId?: string;
}

interface GuestCheckoutContextType {
  guestInfo: GuestInfo | null;
  setGuestInfo: (info: GuestInfo | null) => void;
  isGuestCheckout: boolean;
  startGuestCheckout: (email: string) => void;
  updateGuestInfo: (info: Partial<GuestInfo>) => void;
  clearGuestCheckout: () => void;
  setOrderId: (orderId: string) => void;
}

const GuestCheckoutContext = createContext<GuestCheckoutContextType | undefined>(undefined);

const STORAGE_KEY = "guest_checkout";

export function GuestCheckoutProvider({ children }: { children: React.ReactNode }) {
  const [guestInfo, setGuestInfoState] = useState<GuestInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setGuestInfoState(parsed);
      }
    } catch {
      console.error("Failed to load guest checkout info");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && guestInfo) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guestInfo));
      } catch {
        console.error("Failed to save guest checkout info");
      }
    }
  }, [guestInfo, isInitialized]);

  const startGuestCheckout = useCallback((email: string) => {
    setGuestInfoState({
      email,
      isGuest: true,
    });
  }, []);

  const updateGuestInfo = useCallback((info: Partial<GuestInfo>) => {
    setGuestInfoState((prev) => {
      if (!prev) return null;
      return { ...prev, ...info };
    });
  }, []);

  const clearGuestCheckout = useCallback(() => {
    setGuestInfoState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      console.error("Failed to clear guest checkout info");
    }
  }, []);

  const setOrderId = useCallback((orderId: string) => {
    setGuestInfoState((prev) => {
      if (!prev) return null;
      return { ...prev, orderId };
    });
  }, []);

  return (
    <GuestCheckoutContext.Provider
      value={{
        guestInfo,
        setGuestInfo: setGuestInfoState,
        isGuestCheckout: guestInfo?.isGuest ?? false,
        startGuestCheckout,
        updateGuestInfo,
        clearGuestCheckout,
        setOrderId,
      }}
    >
      {children}
    </GuestCheckoutContext.Provider>
  );
}

export const useGuestCheckout = () => {
  const context = useContext(GuestCheckoutContext);
  if (!context) {
    throw new Error("useGuestCheckout must be used within a GuestCheckoutProvider");
  }
  return context;
};
