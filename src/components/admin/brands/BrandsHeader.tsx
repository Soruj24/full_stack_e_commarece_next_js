"use client";

import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface BrandsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onAddBrand: () => void;
}

export function BrandsHeader({ loading, onRefresh, onAddBrand }: BrandsHeaderProps) {
  return (
    <PageHeader
      title="Brand Management"
      description="Manage product brands and their details."
      action={
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Refresh
          </Button>
          <Button onClick={onAddBrand}>
            <Plus className="w-4 h-4" /> Add Brand
          </Button>
        </div>
      }
    />
  );
}
