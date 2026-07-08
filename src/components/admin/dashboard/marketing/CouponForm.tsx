"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewCouponForm } from "@/modules/admin/types/marketing";

interface CouponFormProps {
  data: NewCouponForm;
  onChange: (data: NewCouponForm) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CouponForm({ data, onChange, onSubmit }: CouponFormProps) {
  const update = (partial: Partial<NewCouponForm>) =>
    onChange({ ...data, ...partial });

  return (
    <div className="p-10 bg-muted/30 border-b border-border/50 animate-in slide-in-from-top duration-300">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 items-end">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Code</Label>
          <Input
            placeholder="SUMMER25"
            className="h-12 rounded-xl border-none bg-background shadow-sm font-bold uppercase"
            value={data.code}
            onChange={(e) => update({ code: e.target.value.toUpperCase() })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Type</Label>
          <select
            className="flex h-12 w-full rounded-xl border-none bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary outline-none"
            value={data.discountType}
            onChange={(e) => update({ discountType: e.target.value })}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Value</Label>
          <Input
            type="number" placeholder="20"
            className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
            value={data.discountAmount}
            onChange={(e) => update({ discountAmount: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Min Purchase</Label>
          <Input
            type="number" placeholder="100"
            className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
            value={data.minPurchase}
            onChange={(e) => update({ minPurchase: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Expiry</Label>
          <Input
            type="date"
            className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
            value={data.expiryDate}
            onChange={(e) => update({ expiryDate: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="h-12 rounded-xl font-black uppercase tracking-wider">
          Create
        </Button>
      </form>
    </div>
  );
}
