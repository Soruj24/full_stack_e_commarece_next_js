"use client";

import { AdminProductDialog } from "@/components/admin/AdminProductDialog";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import {
  InventoryHeader,
  InventoryStats,
  InventorySearch,
  InventoryTable,
} from "@/components/admin/inventory";
import { useAdminInventory } from "@/features/admin/hooks/use-admin-inventory";

export default function InventoryPage() {
  const {
    products, loading, keyword, setKeyword, selectedProduct, setSelectedProduct,
    isDialogOpen, setIsDialogOpen, pagination, fetchInventory,
    handlePageChange, handleDelete, handleAddProduct,
    lowStockProducts, outOfStockProducts, mapToDialogProduct,
  } = useAdminInventory();

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <InventoryHeader
          loading={loading}
          onRefresh={() => fetchInventory(pagination.page)}
          onAddProduct={handleAddProduct}
        />

        <AdminProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          product={mapToDialogProduct(selectedProduct)}
          onSuccess={() => fetchInventory(pagination.page)}
        />

        <InventoryStats
          totalProducts={products.length}
          lowStockCount={lowStockProducts.length}
          outOfStockCount={outOfStockProducts.length}
        />

        <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
          <InventorySearch value={keyword} onChange={setKeyword} />

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
    </div>
  );
}