"use client";

import { useState, useCallback } from "react";
import { Coupon } from "@/types";

export function useCouponDialog(coupon: Coupon | null, onSuccess: () => void, onOpenChange: (open: boolean) => void) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || 0,
    minPurchase: coupon?.minPurchase || 0,
    maxDiscount: coupon?.maxDiscount || 0,
    usageLimit: coupon?.usageLimit || 100,
    startDate: coupon?.startDate || new Date().toISOString().split("T")[0],
    endDate: coupon?.endDate || "",
    isActive: coupon?.isActive ?? true,
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        coupon ? `/api/admin/marketing/coupons/${coupon._id}` : "/api/admin/marketing/coupons",
        { method: coupon ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }
      );
      if (res.ok) { onSuccess(); onOpenChange(false); }
    } catch { console.error("Failed to save coupon"); } finally { setLoading(false); }
  }, [coupon, formData, onSuccess, onOpenChange]);

  return { loading, formData, setFormData, handleSubmit };
}
