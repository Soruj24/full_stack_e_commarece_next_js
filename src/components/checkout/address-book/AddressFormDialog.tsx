"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { SavedAddress } from "@/modules/checkout/types/checkout";

interface AddressFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAddress: SavedAddress | null;
  formData: Partial<SavedAddress>;
  onFormChange: (data: Partial<SavedAddress>) => void;
  onSave: () => void;
}

export function AddressFormDialog({
  isOpen, onOpenChange, editingAddress, formData, onFormChange, onSave,
}: AddressFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {editingAddress ? "Update your address information." : "Enter your address details to save for future orders."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Select value={formData.label} onValueChange={(v) => onFormChange({ ...formData, label: v })}>
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
              <Input id="fullName" value={formData.fullName} onChange={(e) => onFormChange({ ...formData, fullName: e.target.value })} placeholder="John Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => onFormChange({ ...formData, email: e.target.value })} placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => onFormChange({ ...formData, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input id="street" value={formData.street} onChange={(e) => onFormChange({ ...formData, street: e.target.value })} placeholder="123 Main St, Apt 4B" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" value={formData.city} onChange={(e) => onFormChange({ ...formData, city: e.target.value })} placeholder="New York" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input id="state" value={formData.state} onChange={(e) => onFormChange({ ...formData, state: e.target.value })} placeholder="NY" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP / Postal Code *</Label>
              <Input id="zipCode" value={formData.zipCode} onChange={(e) => onFormChange({ ...formData, zipCode: e.target.value })} placeholder="10001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(v) => onFormChange({ ...formData, country: v })}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save Address</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
