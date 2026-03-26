"use client";

import { Tag, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalization } from "@/context/LocalizationContext";
import { convertPrice, formatPrice } from "@/lib/localization";
import { cn } from "@/lib/utils";

interface CouponFormProps {
  couponCode: string;
  couponDiscount: number;
  couponError: string;
  applyingCoupon: boolean;
  onCouponChange: (code: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

export function CouponForm({
  couponCode,
  couponDiscount,
  couponError,
  applyingCoupon,
  onCouponChange,
  onApply,
  onRemove,
}: CouponFormProps) {
  const { currency } = useLocalization();

  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Tag className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold">Discount Code</h3>
      </div>

      {couponDiscount > 0 ? (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-700">
              Code &quot;{couponCode}&quot; applied
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-600"
            aria-label="Remove coupon"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Input
            placeholder="Enter coupon code"
            className="h-12 rounded-xl"
            value={couponCode}
            onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
          />
          <Button
            onClick={onApply}
            disabled={applyingCoupon}
            className="h-12 rounded-xl px-6"
          >
            {applyingCoupon ? "Applying..." : "Apply"}
          </Button>
        </div>
      )}
      {couponError && (
        <p className="text-sm text-red-500 mt-2">{couponError}</p>
      )}
    </div>
  );
}
