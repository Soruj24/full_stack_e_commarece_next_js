"use client";

import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface InventoryHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onAddProduct: () => void;
}

export function InventoryHeader({ loading, onRefresh, onAddProduct }: InventoryHeaderProps) {
  return (
    <PageHeader
      title="Inventory Management"
      description="Track stock levels, manage products, and monitor low-stock alerts."
      action={
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Refresh
          </Button>
          <Button onClick={onAddProduct}>
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      }
    />
  );
}
