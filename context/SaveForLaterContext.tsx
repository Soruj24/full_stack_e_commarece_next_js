"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface SavedItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  addedAt: number;
  priceWhenSaved?: number;
}

interface SaveForLaterContextType {
  savedItems: SavedItem[];
  addToSaveForLater: (item: Omit<SavedItem, "addedAt" | "priceWhenSaved">) => boolean;
  removeFromSaveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearAll: () => void;
  getSavedCount: () => number;
  moveAllToCart: () => void;
}

const SaveForLaterContext = createContext<SaveForLaterContextType | undefined>(undefined);

const STORAGE_KEY = "save_for_later";
const MAX_SAVED_ITEMS = 50;

export function SaveForLaterProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSavedItems(parsed.slice(0, MAX_SAVED_ITEMS));
        }
      }
    } catch {
      console.error("Failed to load saved items");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
      } catch {
        console.error("Failed to save items");
      }
    }
  }, [savedItems, isInitialized]);

  const addToSaveForLater = useCallback((item: Omit<SavedItem, "addedAt" | "priceWhenSaved">): boolean => {
    const existingIndex = savedItems.findIndex((i) => i.id === item.id);
    
    if (existingIndex !== -1) {
      toast.info("Item already saved");
      return false;
    }

    if (savedItems.length >= MAX_SAVED_ITEMS) {
      toast.error(`You can only save up to ${MAX_SAVED_ITEMS} items`);
      return false;
    }

    const newItem: SavedItem = {
      ...item,
      addedAt: Date.now(),
      priceWhenSaved: item.price,
    };

    setSavedItems((prev) => [newItem, ...prev]);
    toast.success(`"${item.name}" saved for later`);
    return true;
  }, [savedItems]);

  const removeFromSaveForLater = useCallback((id: string) => {
    const item = savedItems.find((i) => i.id === id);
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      toast.info(`"${item.name}" removed from saved`);
    }
  }, [savedItems]);

  const isSaved = useCallback((id: string) => {
    return savedItems.some((i) => i.id === id);
  }, [savedItems]);

  const moveToCart = useCallback((id: string) => {
    const item = savedItems.find((i) => i.id === id);
    if (item) {
      removeFromSaveForLater(id);
      toast.success(`"${item.name}" moved to cart`);
    }
  }, [savedItems, removeFromSaveForLater]);

  const clearAll = useCallback(() => {
    setSavedItems([]);
    toast.success("All saved items cleared");
  }, []);

  const getSavedCount = useCallback(() => {
    return savedItems.length;
  }, [savedItems]);

  const moveAllToCart = useCallback(() => {
    const count = savedItems.length;
    setSavedItems([]);
    toast.success(`${count} items moved to cart`);
  }, [savedItems]);

  return (
    <SaveForLaterContext.Provider
      value={{
        savedItems,
        addToSaveForLater,
        removeFromSaveForLater,
        moveToCart,
        isSaved,
        clearAll,
        getSavedCount,
        moveAllToCart,
      }}
    >
      {children}
    </SaveForLaterContext.Provider>
  );
}

export const useSaveForLater = () => {
  const context = useContext(SaveForLaterContext);
  if (!context) {
    throw new Error("useSaveForLater must be used within a SaveForLaterProvider");
  }
  return context;
};
