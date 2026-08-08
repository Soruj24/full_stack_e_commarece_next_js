"use client";

import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface CategoriesHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onAddCategory: () => void;
}

export function CategoriesHeader({ loading, onRefresh, onAddCategory }: CategoriesHeaderProps) {
  return (
    <PageHeader
      title="Category Management"
      description="Organize your products with categories and subcategories."
      action={
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Refresh
          </Button>
          <Button onClick={onAddCategory}>
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </div>
      }
    />
  );
}
