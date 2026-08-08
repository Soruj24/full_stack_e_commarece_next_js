"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ICategory } from "@/shared/types";
import { CategoryRow } from "./CategoryRow";

interface CategoriesTableProps {
  categories: ICategory[];
  selectedIds: string[];
  onEdit: (category: ICategory) => void;
  onDelete: (id: string) => void;
  onToggleActive: (category: ICategory) => void;
  onToggleFeatured: (category: ICategory) => void;
  onSelectAll: (select: boolean) => void;
  onSelectOne: (id: string, select: boolean) => void;
}

export function CategoriesTable({
  categories, selectedIds, onEdit, onDelete, onToggleActive, onToggleFeatured, onSelectAll, onSelectOne,
}: CategoriesTableProps) {
  const allSelected = categories.length > 0 && selectedIds.length === categories.length;

  return (
    <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border/60">
            <tr>
              <th className="py-4 px-6 w-12"><Checkbox checked={allSelected} onCheckedChange={(checked) => onSelectAll(!!checked)} /></th>
              <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Status</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Parent</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Featured</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider w-20">Order</th>
              <th className="text-right py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {categories.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-muted-foreground font-medium">No categories found</td></tr>
            ) : (
              categories.map((category) => (
                <CategoryRow key={category._id} category={category} selected={selectedIds.includes(category._id)}
                  onSelect={onSelectOne} onEdit={onEdit} onDelete={onDelete} onToggleActive={onToggleActive} onToggleFeatured={onToggleFeatured} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}