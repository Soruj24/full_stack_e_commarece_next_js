"use client";

import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddressForm } from "@/modules/checkout/hooks/use-address-form";
import { AddressFormDialog } from "./address-book/AddressFormDialog";
import { AddressCard, AddressEmptyState } from "./address-book/AddressCard";
import type { SavedAddress, ShippingAddress } from "@/modules/checkout/types/checkout";

interface AddressBookProps {
  addresses: SavedAddress[];
  selectedAddress: ShippingAddress | null;
  onSelect: (address: ShippingAddress) => void;
  onSave: (address: SavedAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

function isAddressSelected(addr: SavedAddress, selected: ShippingAddress | null) {
  if (!selected) return false;
  return addr.fullName === selected.fullName && addr.street === selected.street && addr.city === selected.city;
}

export function AddressBook({ addresses, selectedAddress, onSelect, onSave, onDelete }: AddressBookProps) {
  const { isDialogOpen, setIsDialogOpen, editingAddress, formData, setFormData, handleOpenDialog, handleSave } = useAddressForm(addresses, onSave, onSelect);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Saved Addresses
        </h3>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid gap-3">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              isSelected={isAddressSelected(address, selectedAddress)}
              onSelect={onSelect}
              onEdit={handleOpenDialog}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <AddressEmptyState />
      )}

      <AddressFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingAddress={editingAddress}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSave}
      />
    </div>
  );
}
