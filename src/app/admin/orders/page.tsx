"use client";

import { OrdersHeader } from "@/components/admin/orders/OrdersHeader";
import { OrdersStats } from "@/components/admin/orders/OrdersStats";
import { OrdersSearch } from "@/components/admin/orders/OrdersSearch";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { AdminOrderDialog } from "@/components/admin/orders/AdminOrderDialog";
import { useAdminOrders } from "@/modules/admin/hooks/use-admin-orders";

export default function OrdersPage() {
  const {
    filteredOrders, loading, searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    paymentFilter, setPaymentFilter, selectedOrder, setSelectedOrder, isDialogOpen,
    setIsDialogOpen, pagination, fetchOrders, handlePageChange, handleUpdateStatus, stats, status,
  } = useAdminOrders();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrdersHeader loading={loading} onRefresh={() => fetchOrders(pagination.page)} />

      <OrdersStats stats={stats} />

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <OrdersSearch
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          paymentFilter={paymentFilter} setPaymentFilter={setPaymentFilter}
        />

        <OrdersTable
          orders={filteredOrders} loading={loading}
          onView={(order) => { setSelectedOrder(order); setIsDialogOpen(true); }}
          onUpdateStatus={handleUpdateStatus}
        />

        <div className="p-4 border-t border-border/60">
          <ProfessionalPagination
            currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange}
          />
        </div>
      </div>

      <AdminOrderDialog
        open={isDialogOpen} onOpenChange={setIsDialogOpen}
        order={selectedOrder} onSuccess={() => fetchOrders(pagination.page)}
      />
    </div>
  );
}
