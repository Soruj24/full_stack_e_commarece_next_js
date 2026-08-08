"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface CouponsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onAddCoupon: () => void;
}

export function CouponsHeader({ loading, onRefresh, onAddCoupon }: CouponsHeaderProps) {
  return (
    <PageHeader
      title="Coupon Management"
      description="Create and manage discount coupons"
      action={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={onAddCoupon}>
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </Button>
        </div>
      }
    />
  );
}
