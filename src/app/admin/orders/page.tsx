"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  OrdersTable,
  OrdersFilters,
  OrdersBulkActions,
  OrderDetailsDrawer,
  OrdersPagination,
  OrdersEmptyState,
  OrdersErrorState,
  OrdersStats,
  useOrdersManager,
} from "@/components/admin/orders";

export default function OrdersPage() {
  const {
    orders,
    loading,
    error,
    pagination,
    filters,
    sort,
    selectedIds,
    selectedOrder,
    isDrawerOpen,
    stats,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    handleUpdateStatus,
    handleBulkStatusChange,
    handleExport,
    viewOrder,
    closeDrawer,
    refresh,
  } = useOrdersManager();

  const hasActiveFilters =
    !!filters.search ||
    filters.orderStatus !== "all" ||
    filters.paymentStatus !== "all" ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage orders, track shipments, and handle fulfillment."
        action={
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              refresh();
              toast.success("Orders refreshed");
            }}
            className="h-9 w-9 rounded-lg border-border/60"
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        }
      />

      <OrdersStats stats={stats} />

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <OrdersFilters
            filters={filters}
            totalOrders={pagination.total}
            onFilterChange={handleFilterChange}
            onReset={() => {
              handleFilterChange("search", "");
              handleFilterChange("orderStatus", "all");
              handleFilterChange("paymentStatus", "all");
              handleFilterChange("dateFrom", "");
              handleFilterChange("dateTo", "");
            }}
            onExport={handleExport}
          />
        </div>

        <OrdersBulkActions
          selectedCount={selectedIds.size}
          onBulkStatusChange={handleBulkStatusChange}
          onClearSelection={clearSelection}
        />

        {error ? (
          <OrdersErrorState message={error} onRetry={refresh} />
        ) : !loading && orders.length === 0 ? (
          <OrdersEmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={() => {
              handleFilterChange("search", "");
              handleFilterChange("orderStatus", "all");
              handleFilterChange("paymentStatus", "all");
              handleFilterChange("dateFrom", "");
              handleFilterChange("dateTo", "");
            }}
          />
        ) : (
          <OrdersTable
            orders={orders}
            loading={loading}
            sort={sort}
            selectedIds={selectedIds}
            onSort={handleSortChange}
            onSelectAll={toggleSelectAll}
            onSelectOne={toggleSelectOne}
            onView={viewOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        <OrdersPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      </div>

      <OrderDetailsDrawer
        order={selectedOrder}
        open={isDrawerOpen}
        onClose={closeDrawer}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
