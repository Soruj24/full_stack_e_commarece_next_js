"use client";

import { Eye, EyeOff, Star, Archive } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ProductFormData, ProductFormErrors } from "../types";

interface StatusSectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function StatusSection({
  formData,
  errors,
  onChange,
}: StatusSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <Eye className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Active</Label>
              <p className="text-xs text-muted-foreground">
                Visible in store
              </p>
            </div>
          </div>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => onChange("isActive", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <Star className="h-4 w-4 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Featured</Label>
              <p className="text-xs text-muted-foreground">
                Show on homepage
              </p>
            </div>
          </div>
          <Switch
            checked={formData.isFeatured}
            onCheckedChange={(checked) => onChange("isFeatured", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <Star className="h-4 w-4 text-blue-500" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">On Sale</Label>
              <p className="text-xs text-muted-foreground">
                Show discounted price
              </p>
            </div>
          </div>
          <Switch
            checked={formData.onSale}
            onCheckedChange={(checked) => onChange("onSale", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-red-500/10 rounded-lg">
              <Archive className="h-4 w-4 text-red-500" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Archived</Label>
              <p className="text-xs text-muted-foreground">
                Hide from store
              </p>
            </div>
          </div>
          <Switch
            checked={formData.isArchived}
            onCheckedChange={(checked) => onChange("isArchived", checked)}
          />
        </div>
      </div>
    </div>
  );
}
