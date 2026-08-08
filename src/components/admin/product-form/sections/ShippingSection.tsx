"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "../FormField";
import type { ProductFormData, ProductFormErrors } from "../types";

interface ShippingSectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function ShippingSection({
  formData,
  errors,
  onChange,
}: ShippingSectionProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormField label="Weight" htmlFor="weight" description="Optional">
          <div className="flex gap-2">
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => onChange("weight", e.target.value)}
              placeholder="0"
              className="h-10 rounded-lg flex-1"
              min="0"
              step="0.01"
            />
            <Select
              value={formData.weightUnit}
              onValueChange={(v) => onChange("weightUnit", v)}
            >
              <SelectTrigger className="w-24 h-10 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lb">lb</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="oz">oz</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormField>

        <FormField label="Shipping Price" htmlFor="shippingPrice" description="Optional">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="shippingPrice"
              type="number"
              value={formData.shippingPrice}
              onChange={(e) => onChange("shippingPrice", e.target.value)}
              placeholder="0.00"
              className="h-10 rounded-lg pl-7"
              min="0"
              step="0.01"
            />
          </div>
        </FormField>

        <FormField label="Est. Delivery Days" htmlFor="shippingDays" description="Optional">
          <Input
            id="shippingDays"
            type="number"
            value={formData.shippingDays}
            onChange={(e) => onChange("shippingDays", e.target.value)}
            placeholder="e.g. 3-5"
            className="h-10 rounded-lg"
            min="0"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormField label="Length" htmlFor="dimensionsLength">
          <Input
            id="dimensionsLength"
            type="number"
            value={formData.dimensionsLength}
            onChange={(e) => onChange("dimensionsLength", e.target.value)}
            placeholder="0"
            className="h-10 rounded-lg"
            min="0"
            step="0.01"
          />
        </FormField>

        <FormField label="Width" htmlFor="dimensionsWidth">
          <Input
            id="dimensionsWidth"
            type="number"
            value={formData.dimensionsWidth}
            onChange={(e) => onChange("dimensionsWidth", e.target.value)}
            placeholder="0"
            className="h-10 rounded-lg"
            min="0"
            step="0.01"
          />
        </FormField>

        <FormField label="Height" htmlFor="dimensionsHeight">
          <div className="flex gap-2">
            <Input
              id="dimensionsHeight"
              type="number"
              value={formData.dimensionsHeight}
              onChange={(e) => onChange("dimensionsHeight", e.target.value)}
              placeholder="0"
              className="h-10 rounded-lg flex-1"
              min="0"
              step="0.01"
            />
            <Select
              value={formData.dimensionsUnit}
              onValueChange={(v) => onChange("dimensionsUnit", v)}
            >
              <SelectTrigger className="w-24 h-10 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="in">in</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormField>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/60">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Taxable</Label>
          <p className="text-xs text-muted-foreground">
            Charge tax on this product
          </p>
        </div>
        <Switch
          checked={formData.isTaxable}
          onCheckedChange={(checked) => onChange("isTaxable", checked)}
        />
      </div>
    </div>
  );
}
