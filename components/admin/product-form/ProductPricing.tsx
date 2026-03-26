"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormData, Category } from "./types";

interface ProductPricingProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  categories: Category[];
}

export function ProductPricing({
  formData,
  setFormData,
  categories,
}: ProductPricingProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
          Price ($)
        </Label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="0.00"
          className="h-14 rounded-2xl bg-muted/50 border-border/50"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
          Stock
        </Label>
        <Input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          placeholder="0"
          className="h-14 rounded-2xl bg-muted/50 border-border/50"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
          Sale Price ($)
        </Label>
        <Input
          type="number"
          value={formData.discountPrice}
          onChange={(e) =>
            setFormData({ ...formData, discountPrice: e.target.value })
          }
          placeholder="0.00"
          className="h-14 rounded-2xl bg-muted/50 border-border/50"
          disabled={!formData.onSale}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
          Category
        </Label>
        <Select
          value={formData.category}
          onValueChange={(v) => setFormData({ ...formData, category: v })}
        >
          <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-border/50">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
