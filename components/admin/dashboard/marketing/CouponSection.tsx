"use client";

import { Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarketingCoupon, NewCouponForm } from "@/types/admin/marketing";
import { CouponForm } from "./CouponForm";
import { CouponRow } from "./CouponRow";

interface CouponSectionProps {
  coupons: MarketingCoupon[];
  loading: boolean;
  showAdd: boolean;
  newCoupon: NewCouponForm;
  onToggleShow: () => void;
  onNewCouponChange: (data: NewCouponForm) => void;
  onAdd: (e: React.FormEvent) => void;
  onToggleStatus: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}

export function CouponSection({
  coupons, loading, showAdd, newCoupon,
  onToggleShow, onNewCouponChange, onAdd,
  onToggleStatus, onDelete,
}: CouponSectionProps) {
  return (
    <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden">
      <CardHeader className="py-8 px-10 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black text-primary flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            Discount Coupons
          </CardTitle>
          <Button
            onClick={onToggleShow}
            variant={showAdd ? "outline" : "default"}
            className="rounded-2xl font-bold px-6 py-6 h-auto transition-all"
          >
            {showAdd ? "Cancel" : "Add Coupon"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {showAdd && (
          <CouponForm data={newCoupon} onChange={onNewCouponChange} onSubmit={onAdd} />
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-xs font-bold uppercase tracking-widest border-b border-border/50">
                <th className="py-5 px-10">Coupon Info</th>
                <th className="py-5 px-6">Discount</th>
                <th className="py-5 px-6">Min. Purchase</th>
                <th className="py-5 px-6">Expiry</th>
                <th className="py-5 px-6">Usage</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
                        Loading Coupons...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Tag className="h-12 w-12" />
                      <p className="font-black text-xl">No active coupons</p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <CouponRow
                    key={coupon._id}
                    coupon={coupon}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
