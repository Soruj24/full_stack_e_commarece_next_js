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

export default function ProductsPage() {
  const {
    products, loading, keyword, setKeyword, selectedProduct, setSelectedProduct,
    isDialogOpen, setIsDialogOpen, pagination, fetchInventory,
    handlePageChange, handleDelete, handleAddProduct,
    lowStockProducts, outOfStockProducts, mapToDialogProduct,
  } = useAdminInventory();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 rounded-2xl">
              <Package className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Product <span className="text-pink-500">Management</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                View, add, edit, and manage your product catalog
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
              className="rounded-xl h-10 w-10"
            >
              {viewMode === "table" ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => { fetchInventory(pagination.page); toast.success("Products refreshed"); }}
              className="rounded-xl h-10 w-10"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              onClick={handleAddProduct}
              className="rounded-xl h-10 px-4 gap-2 font-bold"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </div>
        </div>

        <InventoryStats
          totalProducts={products.length}
          lowStockCount={lowStockProducts.length}
          outOfStockCount={outOfStockProducts.length}
        />

        <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-muted/50"
              />
            </div>
          </div>

          <InventoryTable
            products={products} loading={loading}
            onEdit={(product) => { setSelectedProduct(product); setIsDialogOpen(true); }}
            onDelete={handleDelete}
          />

          <div className="p-4 border-t border-border/50">
            <ProfessionalPagination
              currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange}
            />
          </div>
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
