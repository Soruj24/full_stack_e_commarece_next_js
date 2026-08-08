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

interface InventorySectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function InventorySection({
  formData,
  errors,
  onChange,
}: InventorySectionProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormField
          label="Stock Quantity"
          htmlFor="stock"
          error={errors.stock}
          required
        >
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => onChange("stock", e.target.value)}
            placeholder="0"
            className="h-10 rounded-lg"
            min="0"
          />
        </FormField>

        <FormField
          label="Low Stock Threshold"
          htmlFor="lowStockThreshold"
          description="Alert when stock falls below this number"
        >
          <Input
            id="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => onChange("lowStockThreshold", e.target.value)}
            placeholder="10"
            className="h-10 rounded-lg"
            min="0"
          />
        </FormField>

        <FormField label="SKU" htmlFor="sku" description="Stock Keeping Unit">
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => onChange("sku", e.target.value)}
            placeholder="e.g. PROD-001"
            className="h-10 rounded-lg"
          />
        </FormField>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/60">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Inventory Tracking</Label>
          <p className="text-xs text-muted-foreground">
            Track stock levels for this product
          </p>
        </div>
        <Switch
          checked={formData.inventoryTracking}
          onCheckedChange={(checked) => onChange("inventoryTracking", checked)}
        />
      </div>
    </div>
  );
}
