import { useState } from "react";
import type { SavedAddress, ShippingAddress } from "@/features/checkout/types/checkout";

const EMPTY_FORM: Partial<SavedAddress> = {
  fullName: "", street: "", city: "", state: "", zipCode: "",
  country: "US", phone: "", email: "", label: "Home",
};

export function useAddressForm(
  addresses: SavedAddress[],
  onSave: (addr: SavedAddress) => void,
  onSelect: (addr: ShippingAddress) => void
) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [formData, setFormData] = useState<Partial<SavedAddress>>(EMPTY_FORM);

  const handleOpenDialog = (address?: SavedAddress) => {
    setEditingAddress(address ?? null);
    setFormData(address ? { ...address } : { ...EMPTY_FORM });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.street || !formData.city || !formData.zipCode) return;
    const newAddress: SavedAddress = {
      _id: editingAddress?._id ?? `addr_${Date.now()}`,
      fullName: formData.fullName,
      street: formData.street,
      city: formData.city,
      state: formData.state || "",
      zipCode: formData.zipCode,
      country: formData.country || "US",
      phone: formData.phone || "",
      email: formData.email || "",
      label: formData.label || "Home",
      isDefault: addresses.length === 0,
    };
    onSave(newAddress);
    setIsDialogOpen(false);
    onSelect(newAddress);
  };

  return { isDialogOpen, setIsDialogOpen, editingAddress, formData, setFormData, handleOpenDialog, handleSave };
}
