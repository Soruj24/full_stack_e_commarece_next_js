"use client";

import { useState } from "react";
import { Package, Plus, Search, Grid3X3, List, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAdminInventory } from "@/modules/admin/hooks/use-admin-inventory";
import { AdminProductDialog } from "@/components/admin/AdminProductDialog";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { InventoryStats } from "@/components/admin/inventory/InventoryStats";
import { InventoryTable } from "@/components/admin/inventory/InventoryTable";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default function ProductsPage() {
  const {
    products, loading, keyword, setKeyword, selectedProduct, setSelectedProduct,
    isDialogOpen, setIsDialogOpen, pagination, fetchInventory,
    handlePageChange, handleDelete, handleAddProduct,
    lowStockProducts, outOfStockProducts, mapToDialogProduct,
  } = useAdminInventory();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="View, add, edit, and manage your product catalog"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
              className="h-9 w-9 rounded-lg border-border/60"
            >
              {viewMode === "table" ? <Grid3X3 className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => { fetchInventory(pagination.page); toast.success("Products refreshed"); }}
              className="h-9 w-9 rounded-lg border-border/60"
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={handleAddProduct} className="h-9 rounded-lg text-sm font-medium px-4 gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Product
            </Button>
          </div>
        }
      />

      <InventoryStats
        totalProducts={products.length}
        lowStockCount={lowStockProducts.length}
        outOfStockCount={outOfStockProducts.length}
      />

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-9 h-9 rounded-lg bg-muted/50 border-border/60 text-sm"
            />
          </div>
        </div>

        <InventoryTable
          products={products} loading={loading}
          onEdit={(product) => { setSelectedProduct(product); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />

        <div className="p-4 border-t border-border/60">
          <ProfessionalPagination
            currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange}
          />
        </div>
      </div>

      <AdminProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={mapToDialogProduct(selectedProduct)}
        onSuccess={() => fetchInventory(pagination.page)}
      />
    </div>
  );
}
