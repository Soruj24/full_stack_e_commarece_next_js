"use client";

import { Check, Edit2, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SavedAddress, ShippingAddress } from "@/features/checkout/types/checkout";

interface AddressCardProps {
  address: SavedAddress;
  isSelected: boolean;
  onSelect: (address: ShippingAddress) => void;
  onEdit: (address: SavedAddress) => void;
  onDelete: (id: string) => void;
}

export function AddressCard({ address, isSelected, onSelect, onEdit, onDelete }: AddressCardProps) {
  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      )}
      onClick={() => onSelect(address)}
    >
      {address.isDefault && (
        <span className="absolute top-2 right-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          Default
        </span>
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
            isSelected ? "border-primary bg-primary" : "border-muted-foreground"
          )}>
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
          <div>
            <p className="font-semibold">{address.fullName}</p>
            <p className="text-sm text-muted-foreground">{address.street}</p>
            <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.zipCode}</p>
            <p className="text-sm text-muted-foreground">{address.country}</p>
            <p className="text-sm text-muted-foreground">{address.phone}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(address); }}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(address._id); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AddressEmptyState() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>No saved addresses yet.</p>
      <p className="text-sm">Add an address to speed up checkout.</p>
    </div>
  );
}
