"use client";

import { useState, useEffect, useCallback } from "react";
import { useRecentlyViewed } from "@/features/common/hooks/RecentlyViewedContext";
import { trackEvent, ANALYTICS_CATEGORIES, ANALYTICS_ACTIONS } from "@/lib/analytics";
import { toast } from "sonner";
import { fetchProduct } from "@/modules/products/services/product-service";
import type { ProductDetail } from "@/features/products/types/product-detail";

export function useProductDetail(id: string) {
  const { addProduct } = useRecentlyViewed();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const load = useCallback(async () => {
    try {
      const p = await fetchProduct(id);
      setProduct(p);
    } catch { /* handled by not-found state */ }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!product) return;
    trackEvent({
      action: ANALYTICS_ACTIONS.VIEW_PRODUCT,
      category: ANALYTICS_CATEGORIES.ECOMMERCE,
      label: product.name,
      value: product.price,
      items: [{ item_id: product._id, item_name: product.name, price: product.price }],
    });
    addProduct({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      slug: id,
      category: product.category?.name,
    });
  }, [product, id, addProduct]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    trackEvent({
      action: ANALYTICS_ACTIONS.ADD_TO_CART,
      category: ANALYTICS_CATEGORIES.ECOMMERCE,
      label: product.name,
      value: product.price * quantity,
      items: [{ item_id: product._id, item_name: product.name, price: product.price, quantity }],
    });
    toast.success(`${product.name} added to cart!`);
  }, [product, quantity]);

  return {
    product, loading, quantity, setQuantity,
    activeImage, setActiveImage, imageError, setImageError,
    handleAddToCart, refetch: load,
  };
}
