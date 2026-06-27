"use client";

import { Coupon } from "@/types";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCouponDialog } from "@/features/admin/hooks/use-coupon-dialog";

interface AdminCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon | null;
  onSuccess: () => void;
}

export function AdminCouponDialog({ open, onOpenChange, coupon, onSuccess }: AdminCouponDialogProps) {
  const { loading, formData, setFormData, handleSubmit } = useCouponDialog(coupon, onSuccess, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
          <DialogDescription>{coupon ? "Update coupon details" : "Fill in the coupon details"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <FormField label="Code" id="code">
              <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="col-span-3" required />
            </FormField>
            <FormField label="Type" id="discountType">
              <Select value={formData.discountType} onValueChange={(value) => setFormData({ ...formData, discountType: value as "percentage" | "fixed" })}>
                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label={formData.discountType === "percentage" ? "Percent" : "Amount"} id="discountValue">
              <Input id="discountValue" type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })} className="col-span-3" required />
            </FormField>
            <FormField label="Min. Purchase" id="minPurchase">
              <Input id="minPurchase" type="number" value={formData.minPurchase} onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })} className="col-span-3" />
            </FormField>
            <FormField label="Usage Limit" id="usageLimit">
              <Input id="usageLimit" type="number" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })} className="col-span-3" />
            </FormField>
            <FormField label="End Date" id="endDate">
              <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="col-span-3" required />
            </FormField>
            <div className="flex items-center gap-4">
              <Label htmlFor="isActive">Active</Label>
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Coupon"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">{label}</Label>
      {children}
    </div>
  );
}
