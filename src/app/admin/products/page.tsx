"use client";

import { RefreshCw, Plus, Package, AlertTriangle, XCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { AdminProductDialog } from "@/components/admin/AdminProductDialog";
import {
  ProductTable,
  ProductFilters,
  ProductBulkActions,
  ProductPagination,
  ProductEmptyState,
  ProductErrorState,
  useProductsManager,
} from "@/components/admin/products";

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    sort,
    selectedIds,
    categories,
    selectedProduct,
    isDialogOpen,
    setIsDialogOpen,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    handleBulkDelete,
    handleBulkStatusChange,
    handleDelete,
    handleAddProduct,
    handleEditProduct,
    mapToDialogProduct,
    refresh,
    lowStockProducts,
    outOfStockProducts,
  } = useProductsManager();

  const hasActiveFilters =
    !!filters.search ||
    !!filters.category ||
    filters.status !== "all" ||
    filters.stock !== "all" ||
    !!filters.priceMin ||
    !!filters.priceMax;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog, inventory, and pricing."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                refresh();
                toast.success("Products refreshed");
              }}
              className="h-9 w-9 rounded-lg border-border/60"
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              onClick={handleAddProduct}
              className="h-9 rounded-lg text-sm font-medium px-4 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Products"
          value={pagination.total.toLocaleString()}
          icon={Package}
          iconColor="text-blue-500"
        />
        <StatCard
          label="Low Stock"
          value={lowStockProducts.length.toLocaleString()}
          icon={AlertTriangle}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Out of Stock"
          value={outOfStockProducts.length.toLocaleString()}
          icon={XCircle}
          iconColor="text-red-500"
        />
        <StatCard
          label="Active"
          value={products.filter((p) => p.isActive && !p.isArchived).length.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-emerald-500"
        />
      </div>

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <ProductFilters
            filters={filters}
            categories={categories}
            totalProducts={pagination.total}
            onFilterChange={handleFilterChange}
            onReset={() => {
              handleFilterChange("search", "");
              handleFilterChange("category", "");
              handleFilterChange("status", "all");
              handleFilterChange("stock", "all");
              handleFilterChange("priceMin", "");
              handleFilterChange("priceMax", "");
            }}
          />
        </div>

        <ProductBulkActions
          selectedCount={selectedIds.size}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onClearSelection={clearSelection}
        />

        {error ? (
          <ProductErrorState message={error} onRetry={refresh} />
        ) : !loading && products.length === 0 ? (
          <ProductEmptyState
            hasFilters={hasActiveFilters}
            onAddProduct={handleAddProduct}
            onClearFilters={() => {
              handleFilterChange("search", "");
              handleFilterChange("category", "");
              handleFilterChange("status", "all");
              handleFilterChange("stock", "all");
              handleFilterChange("priceMin", "");
              handleFilterChange("priceMax", "");
            }}
          />
        ) : (
          <ProductTable
            products={products}
            loading={loading}
            sort={sort}
            selectedIds={selectedIds}
            onSort={handleSortChange}
            onSelectAll={toggleSelectAll}
            onSelectOne={toggleSelectOne}
            onEdit={handleEditProduct}
            onDelete={handleDelete}
          />
        )}

        <ProductPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      </div>

      <AdminProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={mapToDialogProduct(selectedProduct)}
        onSuccess={() => refresh()}
      />
    </div>
  );
}
