"use client";

import { useState } from "react";
import { MapPin, Plus, Check, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { SavedAddress, ShippingAddress } from "@/types/checkout";

interface AddressBookProps {
  addresses: SavedAddress[];
  selectedAddress: ShippingAddress | null;
  onSelect: (address: ShippingAddress) => void;
  onSave: (address: SavedAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressBook({
  addresses,
  selectedAddress,
  onSelect,
  onSave,
  onDelete,
  onSetDefault,
}: AddressBookProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [formData, setFormData] = useState<Partial<SavedAddress>>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    email: "",
    label: "Home",
  });

  const defaultAddress = addresses.find((a) => a.isDefault);

  const handleOpenDialog = (address?: SavedAddress) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
        phone: "",
        email: "",
        label: "Home",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.street || !formData.city || !formData.zipCode) {
      return;
    }

    const newAddress: SavedAddress = {
      _id: editingAddress?._id || `addr_${Date.now()}`,
      fullName: formData.fullName!,
      street: formData.street!,
      city: formData.city!,
      state: formData.state || "",
      zipCode: formData.zipCode!,
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

  const isAddressSelected = (addr: SavedAddress) => {
    if (!selectedAddress) return false;
    return (
      addr.fullName === selectedAddress.fullName &&
      addr.street === selectedAddress.street &&
      addr.city === selectedAddress.city
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Saved Addresses
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? "Update your address information."
                  : "Enter your address details to save for future orders."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Label</Label>
                  <Select
                    value={formData.label}
                    onValueChange={(value) =>
                      setFormData({ ...formData, label: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  placeholder="123 Main St, Apt 4B"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State / Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP / Postal Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    placeholder="10001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="BD">Bangladesh</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Address</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length > 0 ? (
        <div className="grid gap-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                isAddressSelected(address)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
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
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      isAddressSelected(address)
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {isAddressSelected(address) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.street}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.country}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDialog(address);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(address._id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No saved addresses yet.</p>
          <p className="text-sm">Add an address to speed up checkout.</p>
        </div>
      )}
    </div>
  );
}
