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
import { CATEGORY_ICONS } from "@/lib/data/category-icons";
import { ICategory } from "@/shared/types";

interface FormFieldsProps {
  name: string;
  icon: string;
  parent: string;
  categories: ICategory[];
  onFieldChange: (key: string, value: string | boolean | number) => void;
}

export function FormFields({
  name,
  icon,
  parent,
  categories,
  onFieldChange,
}: FormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
            Category Name *
          </Label>
          <Input
            value={name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder="Ex: Electronics"
            className="h-14 rounded-2xl bg-muted/50 border-border/50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
            Icon
          </Label>
          <Select
            value={icon}
            onValueChange={(value) => onFieldChange("icon", value)}
          >
            <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-border/50">
              <SelectValue placeholder="Select Icon" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_ICONS.map((iconOption) => (
                <SelectItem key={iconOption.value} value={iconOption.value}>
                  {iconOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
          Parent Category
        </Label>
        <Select
          value={parent}
          onValueChange={(value) => onFieldChange("parent", value)}
        >
          <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-border/50">
            <SelectValue placeholder="Select Parent Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (Top Level)</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
