"use client";

import { MapPin, Home, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IAddress } from "@/shared/types";

interface AddressCardProps {
  address: IAddress;
  index: number;
  onSetDefault: (index: number) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
}

export function AddressCard({ address, index, onSetDefault, onDelete }: AddressCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-[32px] border transition-all duration-300 relative group",
      address.isDefault ? "bg-primary/5 border-primary shadow-xl shadow-primary/5" : "bg-card border-border/50 hover:border-primary/30"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl", address.isDefault ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
          {address.type === "shipping" ? <MapPin className="w-5 h-5" /> : <Home className="w-5 h-5" />}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!address.isDefault && (
            <Button variant="ghost" size="icon" onClick={() => onSetDefault(index)}
              className="rounded-xl hover:bg-primary/10 hover:text-primary" aria-label="Set as default address">
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onDelete(index)}
            className="rounded-xl hover:bg-destructive/10 hover:text-destructive" aria-label="Delete address">
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
        <p className="text-muted-foreground font-medium">{address.city}, {address.state} {address.zipCode}</p>
        <p className="text-muted-foreground font-medium">{address.country}</p>
      </div>
    </div>
  );
}
