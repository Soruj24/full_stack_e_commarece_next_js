"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IAddress } from "@/types";
import { AddressForm } from "./AddressForm";
import { AddressCard } from "./AddressCard";

interface AddressTabProps {
  addresses: IAddress[];
  onUpdate: (addresses: IAddress[]) => Promise<void>;
  loading: boolean;
}

export function AddressTab({ addresses, onUpdate, loading }: AddressTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState<IAddress>({
    type: "shipping", street: "", city: "", state: "", zipCode: "", country: "", isDefault: false,
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate([...(addresses || []), newAddress]);
    setIsAdding(false);
    setNewAddress({ type: "shipping", street: "", city: "", state: "", zipCode: "", country: "", isDefault: false });
  };

  const handleDeleteAddress = async (index: number) => {
    await onUpdate((addresses || []).filter((_, i) => i !== index));
  };

  const handleSetDefault = async (index: number) => {
    await onUpdate((addresses || []).map((addr, i) => ({ ...addr, isDefault: i === index })));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-tight">Saved Addresses</h3>
          <p className="text-muted-foreground font-medium">Manage your shipping and billing locations</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Add New Address
          </Button>
        )}
      </div>

      {isAdding && (
        <AddressForm address={newAddress} onChange={setNewAddress}
          onSubmit={handleAddAddress} onCancel={() => setIsAdding(false)} loading={loading} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(addresses || []).map((address, index) => (
          <AddressCard key={index} address={address} index={index}
            onSetDefault={handleSetDefault} onDelete={handleDeleteAddress} />
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
            <Button onClick={() => setIsAdding(true)}
              className="relative z-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-12 px-8 bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-500">
              Add New Coordinate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
