"use client";

import { Badge } from "@/components/ui/badge";
import { useAdminVendors } from "@/features/admin/hooks/use-admin-vendors";
import { VendorStatCards } from "@/components/admin/vendors/VendorStatCards";
import { VendorTable } from "@/components/admin/vendors/VendorTable";
import { VendorDetailDialog } from "@/components/admin/vendors/VendorDetailDialog";

export default function AdminVendorsPage() {
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    loading,
    selectedVendor,
    detailOpen,
    rejectReason,
    setRejectReason,
    actionLoading,
    filteredVendors,
    statusCounts,
    vendors,
    handleAction,
    openDetail,
    closeDetail,
  } = useAdminVendors();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage vendor applications</p>
        </div>
        {statusCounts.pending > 0 && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
            {statusCounts.pending} pending applications
          </Badge>
        )}
      </div>

      <VendorStatCards
        statusCounts={statusCounts}
        total={vendors.length}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <VendorTable
        vendors={vendors}
        filteredVendors={filteredVendors}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewDetails={openDetail}
        onAction={handleAction}
      />

      <VendorDetailDialog
        open={detailOpen}
        vendor={selectedVendor}
        rejectReason={rejectReason}
        actionLoading={actionLoading}
        onRejectReasonChange={setRejectReason}
        onClose={closeDetail}
        onAction={handleAction}
      />
    </div>
  );
}
