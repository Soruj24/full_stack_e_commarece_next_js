"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IAddress } from '@/lib/types';

interface AddressFormProps {
  address: IAddress;
  onChange: (addr: IAddress) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function AddressForm({ address, onChange, onSubmit, onCancel, loading }: AddressFormProps) {
  const set = (partial: Partial<IAddress>) => onChange({ ...address, ...partial });

  return (
    <form onSubmit={onSubmit} className="bg-muted/30 p-8 rounded-[32px] border border-border/50 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Address Type</Label>
          <select value={address.type} onChange={(e) => set({ type: e.target.value as "billing" | "shipping" })}
            className="w-full bg-background border-border/50 rounded-2xl p-3 outline-none focus:ring-2 ring-primary/20 transition-all">
            <option value="shipping">Shipping</option>
            <option value="billing">Billing</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Street Address</Label>
          <Input value={address.street} onChange={(e) => set({ street: e.target.value })}
            placeholder="123 Main St" className="rounded-2xl h-12" required />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">City</Label>
          <Input value={address.city} onChange={(e) => set({ city: e.target.value })}
            placeholder="New York" className="rounded-2xl h-12" required />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">State / Province</Label>
          <Input value={address.state} onChange={(e) => set({ state: e.target.value })}
            placeholder="NY" className="rounded-2xl h-12" required />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Zip / Postal Code</Label>
          <Input value={address.zipCode} onChange={(e) => set({ zipCode: e.target.value })}
            placeholder="10001" className="rounded-2xl h-12" required />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Country</Label>
          <Input value={address.country} onChange={(e) => set({ country: e.target.value })}
            placeholder="United States" className="rounded-2xl h-12" required />
        </div>
      </div>
      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" loading={loading} className="rounded-2xl px-8 font-bold">Save Address</Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-2xl font-bold">Cancel</Button>
      </div>
    </form>
  );
}
