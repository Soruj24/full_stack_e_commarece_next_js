"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  InventoryOverview,
  InventoryFiltersBar,
  InventoryTable,
  InventoryBulkActions,
  InventoryPagination,
  InventoryEmptyState,
  InventoryErrorState,
  StockAdjustmentDialog,
  InventoryHistoryDrawer,
  useInventoryManager,
} from "@/components/admin/inventory";

export default function InventoryPage() {
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    sort,
    selectedIds,
    stats,
    history,
    adjustingProduct,
    isAdjustDialogOpen,
    isHistoryOpen,
    setIsAdjustDialogOpen,
    setIsHistoryOpen,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    adjustStock,
    handleBulkAdjust,
    openAdjustDialog,
    openHistory,
    refresh,
  } = useInventoryManager();

  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    handleFilterChange("search", "");
    handleFilterChange("stock", "all");
    handleFilterChange("category", "");
    setResetKey((k) => k + 1);
  };

  const hasActiveFilters = !!filters.search || filters.stock !== "all" || !!filters.category;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Monitor stock levels, adjust quantities, and track inventory status"
      />

      <InventoryOverview stats={stats} />

      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <div className="p-4">
          <InventoryFiltersBar
            key={resetKey}
            filters={filters}
            totalProducts={products.length}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onOpenHistory={openHistory}
            historyCount={history.length}
          />
        </div>

        <InventoryBulkActions
          selectedCount={selectedIds.size}
          onClearSelection={clearSelection}
          onBulkAdjust={handleBulkAdjust}
        />

        {error ? (
          <InventoryErrorState error={error} onRetry={refresh} />
        ) : !loading && products.length === 0 ? (
          <InventoryEmptyState hasFilters={hasActiveFilters} onReset={handleReset} />
        ) : (
          <InventoryTable
            products={products}
            loading={loading}
            sort={sort}
            selectedIds={selectedIds}
            onSort={handleSortChange}
            onSelectAll={toggleSelectAll}
            onSelectOne={toggleSelectOne}
            onAdjustStock={openAdjustDialog}
            onViewHistory={openHistory}
          />
        )}

        {!error && !loading && products.length > 0 && (
          <InventoryPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <StockAdjustmentDialog
        product={adjustingProduct}
        open={isAdjustDialogOpen}
        onOpenChange={setIsAdjustDialogOpen}
        onAdjust={adjustStock}
      />

      <InventoryHistoryDrawer
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        history={history}
      />
    </div>
  );
}
