"use client";

import { AdminProductDialog } from "@/components/admin/AdminProductDialog";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import {
  InventoryHeader,
  InventoryStats,
  InventorySearch,
  InventoryTable,
} from "@/components/admin/inventory";
import { useAdminInventory } from "@/modules/admin/hooks/use-admin-inventory";

export default function InventoryPage() {
  const {
    products, loading, keyword, setKeyword, selectedProduct, setSelectedProduct,
    isDialogOpen, setIsDialogOpen, pagination, fetchInventory,
    handlePageChange, handleDelete, handleAddProduct,
    lowStockProducts, outOfStockProducts, mapToDialogProduct,
  } = useAdminInventory();

  return (
    <div className="space-y-6">
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

        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <InventorySearch value={keyword} onChange={setKeyword} />

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
    </div>
  );
}