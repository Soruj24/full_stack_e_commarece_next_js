"use client";

import { Calendar, Percent, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarketingCoupon } from "@/features/admin/types/marketing";

interface CouponRowProps {
  coupon: MarketingCoupon;
  onToggleStatus: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}

export function CouponRow({ coupon, onToggleStatus, onDelete }: CouponRowProps) {
  return (
    <tr className="group hover:bg-primary/[0.02] transition-colors">
      <td className="py-6 px-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Percent className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">
              {coupon.code}
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Storewide Discount
            </p>
          </div>
        </div>
      </td>
      <td className="py-6 px-6">
        <Badge variant="outline" className="rounded-xl px-3 py-1 font-black text-primary border-primary/20 bg-primary/5">
          {coupon.discountType === "percentage"
            ? `${coupon.discountAmount}%`
            : `$${coupon.discountAmount}`}
        </Badge>
      </td>
      <td className="py-6 px-6 font-bold text-muted-foreground">
        ${coupon.minPurchase}
      </td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2 text-muted-foreground font-bold">
          <Calendar className="h-4 w-4" />
          {new Date(coupon.expiryDate).toLocaleDateString()}
        </div>
      </td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min((coupon.usageCount / (coupon.usageLimit || 100)) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {coupon.usageCount} / {coupon.usageLimit || "∞"}
          </span>
        </div>
      </td>
      <td className="py-6 px-6">
        <button
          onClick={() => onToggleStatus(coupon._id, coupon.isActive)}
          className={cn(
            "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
            coupon.isActive
              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              : "bg-destructive/10 text-destructive hover:bg-destructive/20",
          )}
        >
          {coupon.isActive ? "Active" : "Disabled"}
        </button>
      </td>
      <td className="py-6 px-10 text-right">
        <Button
          variant="ghost" size="icon"
          className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={() => onDelete(coupon._id)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </td>
    </tr>
  );
}
