"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormData, Brand } from "./types";

interface ProductBasicInfoProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  brands: Brand[];
}

export function ProductBasicInfo({
  formData,
  setFormData,
  brands,
}: ProductBasicInfoProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
            Product Name
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Ultra Slim Pro"
            className="h-14 rounded-2xl bg-muted/50 border-border/50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
            Brand
          </Label>
          <Select
            value={formData.brand}
            onValueChange={(v) => setFormData({ ...formData, brand: v })}
          >
            <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-border/50">
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {brands.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No brands found.
                  <br />
                  Please add brands first.
                </div>
              ) : (
                brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
          Description
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Detailed product description..."
          className="min-h-[120px] rounded-3xl bg-muted/50 border-border/50 p-6"
          required
        />
      </div>
    </div>
  );
}
