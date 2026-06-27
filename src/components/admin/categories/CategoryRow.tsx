"use client";

import { Edit3, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ICategory } from '@/lib/types';

interface CategoryRowProps {
  category: ICategory;
  selected: boolean;
  onSelect: (id: string, select: boolean) => void;
  onEdit: (category: ICategory) => void;
  onDelete: (id: string) => void;
  onToggleActive: (category: ICategory) => void;
  onToggleFeatured: (category: ICategory) => void;
}

export function CategoryRow({ category, selected, onSelect, onEdit, onDelete, onToggleActive, onToggleFeatured }: CategoryRowProps) {
  return (
    <tr className={`hover:bg-muted/30 transition-colors ${selected ? "bg-primary/5" : ""}`}>
      <td className="py-4 px-6">
        <Checkbox checked={selected} onCheckedChange={(checked) => onSelect(category._id, !!checked)} />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          {category.image && <img src={category.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
          <div>
            <div className="font-bold text-foreground flex items-center gap-2">
              {category.name}
              {category.icon && <Badge variant="outline" className="text-xs">{category.icon}</Badge>}
            </div>
            <div className="text-xs text-muted-foreground font-mono">/{category.slug}</div>
            {category.description && <div className="text-xs text-muted-foreground truncate max-w-[250px] mt-1">{category.description}</div>}
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <Badge variant={category.isActive !== false ? "default" : "secondary"} className={`rounded-lg ${category.isActive === false ? "bg-muted text-muted-foreground" : "bg-green-500/10 text-green-600"}`}>
          {category.isActive !== false ? "Active" : "Inactive"}
        </Badge>
      </td>
      <td className="py-4 px-6">
        {category.parent ? (
          <Badge variant="outline" className="rounded-lg">{(category.parent as ICategory).name || "Parent"}</Badge>
        ) : (
          <span className="text-muted-foreground text-xs italic">Top Level</span>
        )}
      </td>
      <td className="py-4 px-6">
        {category.isFeatured ? <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> : <span className="text-muted-foreground text-xs">-</span>}
      </td>
      <td className="py-4 px-6"><span className="font-mono text-sm">{category.order || 0}</span></td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-1">
          <IconButton icon={category.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} onClick={() => onToggleActive(category)} hover="hover:bg-blue-500/10 hover:text-blue-600" />
          <IconButton icon={<Star className={`w-4 h-4 ${category.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} />} onClick={() => onToggleFeatured(category)} hover="hover:bg-yellow-500/10 hover:text-yellow-600" />
          <IconButton icon={<Edit3 className="w-4 h-4" />} onClick={() => onEdit(category)} hover="hover:bg-blue-500/10 hover:text-blue-600" />
          <IconButton icon={<Trash2 className="w-4 h-4" />} onClick={() => onDelete(category._id)} hover="hover:bg-red-500/10 hover:text-red-600" />
        </div>
      </td>
    </tr>
  );
}

function IconButton({ icon, onClick, hover }: { icon: React.ReactNode; onClick: () => void; hover: string }) {
  return (
    <Button size="icon" variant="ghost" className={`h-8 w-8 rounded-xl ${hover}`} onClick={onClick}>{icon}</Button>
  );
}
