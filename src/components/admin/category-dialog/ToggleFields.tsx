"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ToggleFieldsProps {
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  onFieldChange: (key: string, value: string | boolean | number) => void;
}

export function ToggleFields({
  isActive,
  isFeatured,
  order,
  onFieldChange,
}: ToggleFieldsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
        <Label className="text-sm font-bold">Active</Label>
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => onFieldChange("isActive", checked)}
        />
      </div>

      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
        <Label className="text-sm font-bold">Featured</Label>
        <Switch
          checked={isFeatured}
          onCheckedChange={(checked) => onFieldChange("isFeatured", checked)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
          Order
        </Label>
        <Input
          type="number"
          value={order}
          onChange={(e) =>
            onFieldChange("order", parseInt(e.target.value) || 0)
          }
          min={0}
          className="h-14 rounded-2xl bg-muted/50 border-border/50"
        />
      </div>
    </div>
  );
}
