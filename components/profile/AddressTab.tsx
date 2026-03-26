// components/profile/AddressTab.tsx
"use client";

import { useState } from "react";
import { Plus, Home, MapPin, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IAddress } from "@/types";

interface AddressTabProps {
  addresses: IAddress[];
  onUpdate: (addresses: IAddress[]) => Promise<void>;
  loading: boolean;
}

export function AddressTab({ addresses, onUpdate, loading }: AddressTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState<IAddress>({
    type: "shipping",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAddresses = [...(addresses || []), newAddress];
    await onUpdate(updatedAddresses);
    setIsAdding(false);
    setNewAddress({
      type: "shipping",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false,
    });
  };

  const handleDeleteAddress = async (index: number) => {
    const updatedAddresses = (addresses || []).filter((_, i) => i !== index);
    await onUpdate(updatedAddresses);
  };

  const handleSetDefault = async (index: number) => {
    const updatedAddresses = (addresses || []).map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    await onUpdate(updatedAddresses);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-tight">Saved Addresses</h3>
          <p className="text-muted-foreground font-medium">Manage your shipping and billing locations</p>
        </div>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddAddress} className="bg-muted/30 p-8 rounded-[32px] border border-border/50 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold ml-1">Address Type</Label>
              <select 
                value={newAddress.type}
                onChange={(e) => setNewAddress({...newAddress, type: e.target.value as "billing" | "shipping"})}
                className="w-full bg-background border-border/50 rounded-2xl p-3 outline-none focus:ring-2 ring-primary/20 transition-all"
              >
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold ml-1">Street Address</Label>
              <Input 
                value={newAddress.street}
                onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                placeholder="123 Main St"
                className="rounded-2xl h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold ml-1">City</Label>
              <Input 
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                placeholder="New York"
                className="rounded-2xl h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold ml-1">State / Province</Label>
              <Input 
                value={newAddress.state}
                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                placeholder="NY"
                className="rounded-2xl h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold ml-1">Zip / Postal Code</Label>
              <Input 
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                placeholder="10001"
                className="rounded-2xl h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold ml-1">Country</Label>
              <Input 
                value={newAddress.country}
                onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                placeholder="United States"
                className="rounded-2xl h-12"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" loading={loading} className="rounded-2xl px-8 font-bold">Save Address</Button>
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="rounded-2xl font-bold">Cancel</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(addresses || []).map((address, index) => (
          <div 
            key={index}
            className={cn(
              "p-6 rounded-[32px] border transition-all duration-300 relative group",
              address.isDefault ? "bg-primary/5 border-primary shadow-xl shadow-primary/5" : "bg-card border-border/50 hover:border-primary/30"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "p-3 rounded-2xl",
                address.isDefault ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                {address.type === "shipping" ? <MapPin className="w-5 h-5" /> : <Home className="w-5 h-5" />}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!address.isDefault && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleSetDefault(index)}
                    className="rounded-xl hover:bg-primary/10 hover:text-primary"
                    aria-label="Set as default address"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteAddress(index)}
                  className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="font-bold text-lg mt-2">{address.street}</p>
              <p className="text-muted-foreground font-medium">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-muted-foreground font-medium">{address.country}</p>
            </div>
          </div>
        ))}

        {(addresses || []).length === 0 && !isAdding && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 sm:py-24 text-center space-y-8 bg-card/50 rounded-[40px] border border-dashed border-border/40 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative group">
              <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] sm:rounded-[32px] bg-card border border-border/40 flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:-rotate-12">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
            </div>
            <div className="space-y-3 max-w-xs relative z-10 px-4">
              <h3 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic">
                Logistics <span className="text-primary not-italic">Offline</span>
              </h3>
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed uppercase tracking-widest">
                No destination coordinates found in your profile. Add an address to enable rapid deployment.
              </p>
            </div>
            <Button 
              onClick={() => setIsAdding(true)}
              className="relative z-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-12 px-8 bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-500"
            >
              Add New Coordinate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
