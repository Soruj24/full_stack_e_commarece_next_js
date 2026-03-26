"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface CompareProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: {
    name: string;
    slug: string;
  };
  brand?: string;
  description?: string;
  stock?: number;
  rating?: number;
  numReviews?: number;
  specifications?: Record<string, string>;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  weight?: string;
  dimensions?: string;
  material?: string;
  warranty?: string;
  addedAt: number;
}

interface CompareContextType {
  products: CompareProduct[];
  addProduct: (product: Omit<CompareProduct, "addedAt">) => boolean;
  removeProduct: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
  canAddMore: boolean;
  maxProducts: number;
  getProductById: (id: string) => CompareProduct | undefined;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_PRODUCTS = 4;
const STORAGE_KEY = "product_compare";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProducts(parsed.slice(0, MAX_COMPARE_PRODUCTS));
        }
      }
    } catch {
      console.error("Failed to load compared products");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch {
        console.error("Failed to save compared products");
      }
    }
  }, [products, isInitialized]);

  const addProduct = useCallback((product: Omit<CompareProduct, "addedAt">): boolean => {
    if (products.some((p) => p._id === product._id)) {
      toast.info("Product already in comparison");
      return false;
    }

    if (products.length >= MAX_COMPARE_PRODUCTS) {
      toast.error(`You can compare up to ${MAX_COMPARE_PRODUCTS} products`);
      return false;
    }

    setProducts((prev) => [...prev, { ...product, addedAt: Date.now() }]);
    toast.success(`Added ${product.name} to compare`);
    return true;
  }, [products]);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const product = prev.find((p) => p._id === id);
      if (product) {
        toast.info(`Removed ${product.name} from comparison`);
      }
      return prev.filter((p) => p._id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setProducts([]);
    toast.success("Comparison cleared");
  }, []);

  const isInCompare = useCallback((id: string) => {
    return products.some((p) => p._id === id);
  }, [products]);

  const getProductById = useCallback((id: string) => {
    return products.find((p) => p._id === id);
  }, [products]);

  const canAddMore = products.length < MAX_COMPARE_PRODUCTS;

  return (
    <CompareContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        clearAll,
        isInCompare,
        canAddMore,
        maxProducts: MAX_COMPARE_PRODUCTS,
        getProductById,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
