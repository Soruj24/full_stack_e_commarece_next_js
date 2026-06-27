"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Bundle, useBundle } from "@/features/bundles/context/BundleContext";

export function useBundleCard(bundle: Bundle) {
  const { addBundleToCart, isBundleInCart } = useBundle();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inCart = isBundleInCart(bundle._id);
  const isLowStock = bundle.stock > 0 && bundle.stock <= 5;
  const isOutOfStock = bundle.stock === 0;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOutOfStock) {
        toast.error("This bundle is currently out of stock");
        return;
      }

      setIsAdding(true);
      addBundleToCart(bundle);

      setTimeout(() => {
        setJustAdded(true);
        setIsAdding(false);
        toast.success(`${bundle.name} added to cart!`);
        setTimeout(() => setJustAdded(false), 2000);
      }, 500);
    },
    [bundle, isOutOfStock, addBundleToCart]
  );

  return { inCart, isLowStock, isOutOfStock, isAdding, justAdded, handleAddToCart };
}
