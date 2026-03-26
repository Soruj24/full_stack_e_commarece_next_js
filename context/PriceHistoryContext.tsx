"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export interface PricePoint {
  date: string;
  price: number;
  source?: string;
}

export interface PriceHistory {
  productId: string;
  productName: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  priceChange: number;
  priceChangePercentage: number;
  lowestPriceDate: string;
  highestPriceDate: string;
  pricePoints: PricePoint[];
  lastUpdated: string;
}

interface PriceHistoryContextType {
  priceHistory: Record<string, PriceHistory>;
  isLoading: boolean;
  error: string | null;
  fetchPriceHistory: (productId: string) => Promise<PriceHistory | null>;
  getPriceHistory: (productId: string) => PriceHistory | null;
  clearPriceHistory: (productId: string) => void;
}

const PriceHistoryContext = createContext<PriceHistoryContextType | undefined>(
  undefined
);

const MAX_CACHED_HISTORIES = 50;

export function PriceHistoryProvider({ children }: { children: ReactNode }) {
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceHistory>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceHistory = useCallback(
    async (productId: string): Promise<PriceHistory | null> => {
      if (priceHistory[productId]) {
        return priceHistory[productId];
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/products/${productId}/price-history`);
        const data = await res.json();

        if (data.success && data.priceHistory) {
          setPriceHistory((prev) => {
            const updated = { ...prev, [productId]: data.priceHistory };
            const keys = Object.keys(updated);
            if (keys.length > MAX_CACHED_HISTORIES) {
              const keysToRemove = keys.slice(0, keys.length - MAX_CACHED_HISTORIES);
              keysToRemove.forEach((key) => delete updated[key]);
            }
            return updated;
          });
          return data.priceHistory;
        }
        return null;
      } catch (err) {
        console.error("Failed to fetch price history:", err);
        setError("Failed to load price history");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [priceHistory]
  );

  const getPriceHistory = useCallback(
    (productId: string): PriceHistory | null => {
      return priceHistory[productId] || null;
    },
    [priceHistory]
  );

  const clearPriceHistory = useCallback((productId: string) => {
    setPriceHistory((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  }, []);

  return (
    <PriceHistoryContext.Provider
      value={{
        priceHistory,
        isLoading,
        error,
        fetchPriceHistory,
        getPriceHistory,
        clearPriceHistory,
      }}
    >
      {children}
    </PriceHistoryContext.Provider>
  );
}

export function usePriceHistory() {
  const context = useContext(PriceHistoryContext);
  if (context === undefined) {
    throw new Error("usePriceHistory must be used within a PriceHistoryProvider");
  }
  return context;
}
