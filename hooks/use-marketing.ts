"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  MarketingCoupon,
  MarketingBanner,
  SaleProduct,
  NewCouponForm,
  NewBannerForm,
} from "@/types/admin/marketing";
import * as marketingService from "@/lib/services/marketing-service";

export function useMarketing() {
  const [coupons, setCoupons] = useState<MarketingCoupon[]>([]);
  const [banners, setBanners] = useState<MarketingBanner[]>([]);
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saleLoading, setSaleLoading] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);

  const [newCoupon, setNewCoupon] = useState<NewCouponForm>({
    code: "",
    discountType: "percentage",
    discountAmount: 0,
    minPurchase: 0,
    expiryDate: "",
    usageLimit: 0,
  });

  const [newBanner, setNewBanner] = useState<NewBannerForm>({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    type: "promotion",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await marketingService.fetchMarketingData();
      setCoupons(data.coupons);
      setBanners(data.banners);
      setProducts(data.products);
    } catch {
      toast.error("Failed to fetch marketing data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await marketingService.createBanner(newBanner);
    if (success) {
      toast.success("Banner created successfully");
      setShowAddBanner(false);
      setNewBanner({ title: "", subtitle: "", image: "", link: "", type: "promotion" });
      fetchData();
    } else {
      toast.error("Error creating banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    const ok = await marketingService.deleteBanner(id);
    if (ok) {
      toast.success("Banner deleted");
      fetchData();
    } else {
      toast.error("Failed to delete banner");
    }
  };

  const handleToggleBannerStatus = async (id: string, current: boolean) => {
    const ok = await marketingService.toggleBannerStatus(id, current);
    if (ok) {
      toast.success("Status updated");
      fetchData();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await marketingService.createCoupon(newCoupon);
    if (data.success) {
      toast.success("Coupon created successfully");
      setShowAddCoupon(false);
      setNewCoupon({
        code: "", discountType: "percentage", discountAmount: 0,
        minPurchase: 0, expiryDate: "", usageLimit: 0,
      });
      fetchData();
    } else {
      toast.error(data.error || "Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    const ok = await marketingService.deleteCoupon(id);
    if (ok) {
      toast.success("Coupon deleted");
      fetchData();
    } else {
      toast.error("Failed to delete coupon");
    }
  };

  const handleToggleCouponStatus = async (id: string, current: boolean) => {
    const ok = await marketingService.toggleCouponStatus(id, current);
    if (ok) {
      toast.success("Status updated");
      fetchData();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleToggleSale = async (
    productId: string,
    onSale: boolean,
    discountPrice?: number,
  ) => {
    setSaleLoading(true);
    try {
      const ok = await marketingService.toggleProductSale(productId, onSale, discountPrice);
      if (ok) {
        toast.success(onSale ? "Product added to sale" : "Product removed from sale");
        fetchData();
      }
    } catch {
      toast.error("Failed to update sale status");
    } finally {
      setSaleLoading(false);
    }
  };

  return {
    coupons, banners, products, loading, saleLoading,
    showAddCoupon, setShowAddCoupon,
    showAddBanner, setShowAddBanner,
    newCoupon, setNewCoupon,
    newBanner, setNewBanner,
    handleAddBanner, handleDeleteBanner, handleToggleBannerStatus,
    handleAddCoupon, handleDeleteCoupon, handleToggleCouponStatus,
    handleToggleSale,
    refresh: fetchData,
  };
}
