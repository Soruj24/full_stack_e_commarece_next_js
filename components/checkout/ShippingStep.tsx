"use client";

import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

interface ShippingStepProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
}

export function ShippingStep({ address, onChange }: ShippingStepProps) {
  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 sm:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Shipping Information</h2>
          <p className="text-sm text-muted-foreground">
            Where should we send your order?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label>Full Name</Label>
          <Input
            placeholder="John Doe"
            className="h-12 rounded-xl"
            value={address.fullName}
            onChange={(e) => onChange({ ...address, fullName: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="john@example.com"
            className="h-12 rounded-xl"
            value={address.email}
            onChange={(e) => onChange({ ...address, email: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Phone Number</Label>
          <Input
            placeholder="+1 (555) 123-4567"
            className="h-12 rounded-xl"
            value={address.phone}
            onChange={(e) => onChange({ ...address, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Street Address</Label>
          <Input
            placeholder="123 Main Street, Apt 4B"
            className="h-12 rounded-xl"
            value={address.street}
            onChange={(e) => onChange({ ...address, street: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            placeholder="New York"
            className="h-12 rounded-xl"
            value={address.city}
            onChange={(e) => onChange({ ...address, city: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>State / Province</Label>
          <Input
            placeholder="NY"
            className="h-12 rounded-xl"
            value={address.state}
            onChange={(e) => onChange({ ...address, state: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>ZIP / Postal Code</Label>
          <Input
            placeholder="10001"
            className="h-12 rounded-xl"
            value={address.zipCode}
            onChange={(e) => onChange({ ...address, zipCode: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={address.country}
            onValueChange={(value) => onChange({ ...address, country: value })}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="BD">Bangladesh</SelectItem>
              <SelectItem value="IN">India</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
