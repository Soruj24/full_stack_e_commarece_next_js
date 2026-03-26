"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface CouponsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onAddCoupon: () => void;
}

export function CouponsHeader({ loading, onRefresh, onAddCoupon }: CouponsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Coupon Management</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage discount coupons
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
        <Button onClick={onAddCoupon}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>
    </div>
  );
}
