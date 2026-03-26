"use client";

import { Edit3, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ICategory } from "@/types";

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
  categories,
  selectedIds,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onSelectAll,
  onSelectOne,
}: CategoriesTableProps) {
  const allSelected = categories.length > 0 && selectedIds.length === categories.length;

  return (
    <div className="bg-card rounded-[32px] border border-border/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border/50">
            <tr>
              <th className="py-4 px-6 w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                />
              </th>
              <th className="text-left py-4 px-6 font-black text-xs uppercase tracking-widest text-muted-foreground">Name</th>
              <th className="text-left py-4 px-6 font-black text-xs uppercase tracking-widest text-muted-foreground w-24">Status</th>
              <th className="text-left py-4 px-6 font-black text-xs uppercase tracking-widest text-muted-foreground">Parent</th>
              <th className="text-left py-4 px-6 font-black text-xs uppercase tracking-widest text-muted-foreground w-24">Featured</th>
              <th className="text-left py-4 px-6 font-black text-xs uppercase tracking-widest text-muted-foreground w-20">Order</th>
              <th className="text-right py-4 px-6 font-black text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground font-medium">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category._id}
                  className={`hover:bg-muted/30 transition-colors ${
                    selectedIds.includes(category._id) ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="py-4 px-6">
                    <Checkbox
                      checked={selectedIds.includes(category._id)}
                      onCheckedChange={(checked) => onSelectOne(category._id, !!checked)}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {category.image && (
                        <img
                          src={category.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-2">
                          {category.name}
                          {category.icon && (
                            <Badge variant="outline" className="text-xs">
                              {category.icon}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          /{category.slug}
                        </div>
                        {category.description && (
                          <div className="text-xs text-muted-foreground truncate max-w-[250px] mt-1">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge
                      variant={category.isActive !== false ? "default" : "secondary"}
                      className={`rounded-lg ${
                        category.isActive === false
                          ? "bg-muted text-muted-foreground"
                          : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                      }`}
                    >
                      {category.isActive !== false ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    {category.parent ? (
                      <Badge variant="outline" className="rounded-lg">
                        {(category.parent as ICategory).name || "Parent"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">Top Level</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {category.isFeatured ? (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm">{category.order || 0}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-xl hover:bg-blue-500/10 hover:text-blue-600"
                        onClick={() => onToggleActive(category)}
                        title={category.isActive !== false ? "Deactivate" : "Activate"}
                      >
                        {category.isActive !== false ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-xl hover:bg-yellow-500/10 hover:text-yellow-600"
                        onClick={() => onToggleFeatured(category)}
                        title={category.isFeatured ? "Remove from featured" : "Add to featured"}
                      >
                        <Star className={`w-4 h-4 ${category.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-xl hover:bg-blue-500/10 hover:text-blue-600"
                        onClick={() => onEdit(category)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-xl hover:bg-red-500/10 hover:text-red-600"
                        onClick={() => onDelete(category._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}