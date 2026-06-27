"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { IProduct } from "@/types";
import { QuickViewModal } from "@/components/products/QuickViewModal";

interface QuickViewContextType {
  openQuickView: (product: IProduct) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error("useQuickView must be used within QuickViewProvider");
  }
  return context;
}

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openQuickView = (product: IProduct) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
  };

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
      {children}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isOpen}
        onClose={closeQuickView}
      />
    </QuickViewContext.Provider>
  );
}
