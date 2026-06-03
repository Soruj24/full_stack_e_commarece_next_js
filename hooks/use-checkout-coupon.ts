"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { validateCoupon } from "@/lib/services/checkout-service";
import { convertPrice, formatPrice } from "@/lib/localization";

export function useCheckoutCoupon(currency: string) {
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = useCallback(async (subtotal: number) => {
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return; }
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const result = await validateCoupon(couponCode, subtotal);
      if (result.success) {
        setCouponDiscount(result.discount ?? 0);
        toast.success(`Coupon applied! You save ${formatPrice(convertPrice(result.discount ?? 0, currency), currency)}`);
      } else setCouponError(result.error || "Invalid coupon code");
    } catch { setCouponError("Failed to validate coupon"); }
    finally { setApplyingCoupon(false); }
  }, [couponCode, currency]);

  const handleRemoveCoupon = useCallback(() => {
    setCouponCode(""); setCouponDiscount(0); setCouponError("");
  }, []);

  return {
    couponCode, setCouponCode, couponDiscount, couponError,
    applyingCoupon, handleApplyCoupon, handleRemoveCoupon,
  };
}
