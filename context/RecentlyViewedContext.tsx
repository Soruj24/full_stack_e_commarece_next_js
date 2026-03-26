"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
  viewedAt: number;
}

interface RecentlyViewedContextType {
  products: RecentlyViewedProduct[];
  addProduct: (product: Omit<RecentlyViewedProduct, "viewedAt">) => void;
  removeProduct: (id: string) => void;
  clearAll: () => void;
  isInRecentlyViewed: (id: string) => boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENTLY_VIEWED = 10;
const STORAGE_KEY = "recently_viewed";

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProducts(parsed.slice(0, MAX_RECENTLY_VIEWED));
        }
      }
    } catch {
      console.error("Failed to load recently viewed products");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch {
        console.error("Failed to save recently viewed products");
      }
    }
  }, [products, isInitialized]);

  const addProduct = useCallback((product: Omit<RecentlyViewedProduct, "viewedAt">) => {
    setProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      
      if (existing) {
        return [
          { ...existing, viewedAt: Date.now() },
          ...prev.filter((p) => p.id !== product.id),
        ].slice(0, MAX_RECENTLY_VIEWED);
      }
      
      return [
        { ...product, viewedAt: Date.now() },
        ...prev,
      ].slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setProducts([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isInRecentlyViewed = useCallback((id: string) => {
    return products.some((p) => p.id === id);
  }, [products]);

  return (
    <RecentlyViewedContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        clearAll,
        isInRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
};
